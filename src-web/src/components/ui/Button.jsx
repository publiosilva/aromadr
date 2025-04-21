import PropTypes from 'prop-types';
import styles from './Button.module.css';
import clsx from 'clsx';

const Button = ({ small = false, ...props }) => (
  <button className={clsx(styles.button, { [styles.small]: small })} {...props}></button>
);

Button.propTypes = {
  small: PropTypes.bool,
};

export { Button }
