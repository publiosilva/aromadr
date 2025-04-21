import PropTypes from 'prop-types';
import styles from './Card.module.css';

export const Card = ({ children, className }) => (
  <div className={`${styles.card} ${className}`}>{children}</div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardContent = ({ children }) => (
  <div className={styles.cardContent}>{children}</div>
);

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};
