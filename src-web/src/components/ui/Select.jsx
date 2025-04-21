import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './Select.module.css';

const Select = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.selectContainer}>
      <div
        className={styles.selectedValue}
        onClick={toggleDropdown}
      >
        {options.find(option => option.value === value)?.label || 'Select...'}
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map(option => (
            <div
              key={option.value}
              className={styles.option}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export { Select };
