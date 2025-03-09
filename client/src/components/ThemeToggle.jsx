import React, { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-gray-300 dark:bg-gray-700 dark:text-white"
    >
      {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
};

export default ThemeToggle;
