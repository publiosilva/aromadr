import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ToastContainer, toast } from 'react-toastify';
import { TestSmellTree } from './TestSmellTree';
import styles from './ProjectTestSmellDetector.module.css';

const ProjectTestSmellDetector = () => {
  const [state, setState] = useState({
    languageFramework: 'csharp-xunit',
    repositoryURL: '',
    results: null,
    loading: false,
    collapsedIndexes: new Set(),
  });

  const { languageFramework, repositoryURL, results, loading, collapsedIndexes } = state;

  const handleChange = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleDetect = async () => {
    setState(prev => ({ ...prev, loading: true }));
    const [language, framework] = languageFramework.split('-');
    try {
      const response = await axios.post('http://localhost:3000/project-test-smells/detect', {
        language,
        framework,
        repositoryURL,
      });
      setState(prev => ({ ...prev, results: response.data, loading: false }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while detecting test smells.', { position: 'top-right', autoClose: 5000 });
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const downloadJson = () => {
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'test-smells-report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleCollapse = index => {
    setState(prev => {
      const newCollapsedIndexes = new Set(prev.collapsedIndexes);
      newCollapsedIndexes.has(index) ? newCollapsedIndexes.delete(index) : newCollapsedIndexes.add(index);
      return { ...prev, collapsedIndexes: newCollapsedIndexes };
    });
  };

  const collapseAll = () => {
    setState(prev => ({ ...prev, collapsedIndexes: new Set(results.map((_, index) => index)) }));
  };

  const expandAll = () => {
    setState(prev => ({ ...prev, collapsedIndexes: new Set() }));
  };

  const getAllTestSmells = result => (
    result.testSuites.flatMap(suiteObj =>
      suiteObj.tests.flatMap(testObj => testObj.testSmells)
    )
  );

  const languageFrameworkOptions = [
    { value: 'csharp-xunit', label: 'C# - xUnit' },
    { value: 'java-junit', label: 'Java - JUnit' },
    { value: 'javascript-jest', label: 'JavaScript - Jest or TypeScript - Jest' },
    { value: 'python-pytest', label: 'Python - PyTest' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detect Test Smells on a GitHub Project</h1>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Language and Framework</label>
          <Select
            options={languageFrameworkOptions}
            value={languageFramework}
            onChange={value => handleChange('languageFramework', value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Repository URL</label>
          <Input
            placeholder="Enter repository URL"
            value={repositoryURL}
            onChange={e => handleChange('repositoryURL', e.target.value)}
          />
        </div>
        <Button
          onClick={handleDetect}
          disabled={loading}
        >
          {loading ? 'Detecting...' : 'Detect Test Smells'}
        </Button>
      </div>
      {results && (
        <div className={styles.separator}></div>
      )}
      {results && (
        <div className={styles.resultActions}>
          <Button onClick={downloadJson}>Download JSON Report</Button>
          <Button onClick={collapseAll}>Collapse All</Button>
          <Button onClick={expandAll}>Expand All</Button>
        </div>
      )}
      {results && (
        <div className={styles.results}>
          {results.map((result, index) => {
            const testSmells = getAllTestSmells(result);
            return (
              <Card key={index}>
                <CardContent>
                  <div className={styles.cardHeader} onClick={() => toggleCollapse(index)}>
                    <div className={styles.testFileName}>
                      <span>{result.testFilePath}</span>
                      <span className={styles.collapseButton}>
                        {collapsedIndexes.has(index) ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>
                  {!collapsedIndexes.has(index) && (
                    <div>
                      <SyntaxHighlighter
                        language={languageFramework.split('-')[0]}
                        style={vscDarkPlus}
                        showLineNumbers
                        wrapLines
                        lineProps={(lineNumber) => {
                          const smell = testSmells.find(smell => lineNumber >= smell.startLine && lineNumber <= smell.endLine);
                          return smell ? {
                            style: {
                              borderLeftColor: 'red',
                              borderLeftStyle: 'solid',
                              borderLeftWidth: 2,
                              backgroundColor: 'rgba(255, 0, 0, 0.2)',
                              display: 'block',
                              width: '100%',
                            },
                            'data-smell': smell.name,
                            className: 'test-smell-line',
                          } : {};
                        }}
                      >
                        {result.testFileContent}
                      </SyntaxHighlighter>
                    </div>
                  )}
                  <TestSmellTree testSuites={result.testSuites}></TestSmellTree>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ProjectTestSmellDetector;
