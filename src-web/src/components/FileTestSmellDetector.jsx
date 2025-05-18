import { useState, useCallback } from 'react';
import axios from 'axios';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { ToastContainer, toast } from 'react-toastify';
import { TestSmellTree } from './TestSmellTree';
import styles from './FileTestSmellDetector.module.css';

const FileTestSmellDetector = () => {
  const [state, setState] = useState({
    testFileContent: '',
    languageFramework: 'csharp-xunit',
    loading: false,
    result: null,
  });

  const { testFileContent, languageFramework, loading, result } = state;

  const handleChange = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleDetect = async (value) => {
    setState(prev => ({ ...prev, loading: true }));
    const [language, framework] = languageFramework.split('-');

    // Use a fallback value if no value is passed
    const content = value && typeof value === 'string' ? value : testFileContent;

    try {
      const response = await axios.post('http://localhost:3000/file-test-smells/detect', {
        language,
        framework,
        testFileContent: content,
      });
      setState(prev => ({ ...prev, result: response.data, loading: false }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while detecting test smells.', { position: 'top-right', autoClose: 5000 });
      setState(prev => ({ ...prev, loading: false }));
    }
  }

  const onTestFileContentChange = useCallback((val) => {
    handleChange('testFileContent', val)
  }, []);

  const handleRefactor = async ({ test, testSmell }) => {
    if (!loading) {
      setState(prev => ({ ...prev, loading: true }));
      try {
        const response = await axios.post('http://localhost:3000/file-test-smells/refactor', {
          testFileAST: result.testFileAST,
          test,
          testSmell
        });
        const newTestFileContent = response.data.testFileContent;
        setState(prev => ({ ...prev, testFileContent: newTestFileContent, loading: false }));

        handleDetect(newTestFileContent);
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred while refactoring test smells.', { position: 'top-right', autoClose: 5000 });
        setState(prev => ({ ...prev, loading: false }));
      }
    }
  }

  const languageFrameworkOptions = [
    { value: 'csharp-xunit', label: 'C# - xUnit' },
    { value: 'java-junit', label: 'Java - JUnit' },
    { value: 'javascript-jest', label: 'JavaScript - Jest or TypeScript - Jest' },
    { value: 'python-pytest', label: 'Python - PyTest' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detect Test Smells on a File</h1>
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
          <label className={styles.inputLabel}>Test File Content</label>
          <div className={styles.editorContainer}>
            <CodeMirror
              value={testFileContent}
              height="400px"
              theme={vscodeDark}
              onChange={onTestFileContentChange}
            />
          </div>
        </div>
        <Button
          onClick={handleDetect}
          disabled={loading}
        >
          {loading ? 'Detecting...' : 'Detect Test Smells'}
        </Button>
        {result && (
          <div className={styles.separator}></div>
        )}
        {result && (
          <TestSmellTree
            testSuites={result.testSuites}
            allowRefactoring={false}
            onRefactor={handleRefactor}
          ></TestSmellTree>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FileTestSmellDetector;
