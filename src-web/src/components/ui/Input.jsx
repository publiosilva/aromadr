import styles from './Input.module.css';

export const Input = ({ ...props }) => (
  <input className={styles.inputField} {...props} />
);
