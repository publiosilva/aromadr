import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import ProjectTestSmellDetector from './components/ProjectTestSmellDetector';
import FileTestSmellDetector from './components/FileTestSmellDetector';
import styles from './App.module.css';

const App = () => {
  return (
    <Router>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>AromaDR</h1>
          <p className={styles.subtitle}>A language-independent tool to detect test smells.</p>
        </header>

        <div className={styles.main}>
          <aside className={styles.sidebar}>
            <ul className={styles.navList}>
              <li>
                <NavLink
                  to="/file"
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  Detect on a File
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/project"
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  Detect on a Project
                </NavLink>
              </li>
            </ul>
          </aside>

          <div className={styles.content}>
            <Routes>
              <Route path="/" element={<Navigate to="/file" />} />
              <Route path="/file" element={<FileTestSmellDetector />} />
              <Route path="/project" element={<ProjectTestSmellDetector />} />
            </Routes>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>&copy; 2025 AromaDR. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
