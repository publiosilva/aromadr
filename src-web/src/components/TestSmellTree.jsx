import PropTypes from 'prop-types';
import { Button } from './ui/Button';
import styles from './TestSmellTree.module.css';

const TestSmellTree = ({ testSuites, allowRefactoring, onRefactor }) => {
  return (
    <div className={styles.fileTree}>
      {testSuites.map((suiteObj, i) => (
        <div key={i} className={styles.node}>
          <div className={styles.nodeHeader}>
            <span className={styles.branchIcon}>──</span>
            <span className={styles.nodeName}>{suiteObj.testSuite.name}</span>
          </div>
          <div className={styles.childNodes}>
            {suiteObj.tests.map((testObj, j) => (
              <div key={j} className={styles.node}>
                <div className={styles.nodeHeader}>
                  <span className={styles.branchIcon}>──</span>
                  <span className={styles.nodeName}>{testObj.test.name}</span>
                </div>
                <div className={styles.childNodes}>
                  {testObj.testSmells.map((smell, k) => (
                    <div key={k} className={styles.node}>
                      <div className={styles.nodeHeader}>
                        <span className={styles.branchIcon}>──</span>
                        <span className={styles.nodeName}>
                          <strong>{smell.name}</strong> at lines {smell.startLine}-{smell.endLine}
                        </span>
                        {allowRefactoring && (
                          <Button
                            small={true}
                            onClick={() => onRefactor({ test: testObj.test, testSmell: smell })}
                          >
                            Refactor
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

TestSmellTree.propTypes = {
  testSuites: PropTypes.array.isRequired,
  allowRefactoring: PropTypes.bool,
  onRefactor: PropTypes.func,
};

export { TestSmellTree };
