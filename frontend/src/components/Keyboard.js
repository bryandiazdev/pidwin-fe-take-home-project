import React from 'react';
import './Keyboard.css';

const Keyboard = ({ onKeyPress, keyStatuses }) => {
  const keyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
  ];

  return (
    <div className="keyboard">
      {keyRows.map((row, rowIndex) => (
        <div className="keyboard-row" key={`keyboard-row-${rowIndex}`}>
          {row.map((key) => {
            let statusClass = '';
            if (keyStatuses[key]) {
              statusClass = keyStatuses[key];
            }

            return (
              <button
                key={key}
                className={`keyboard-key ${key === 'Enter' || key === 'Backspace' ? 'special-key' : ''} ${statusClass}`}
                onClick={() => onKeyPress(key)}
                aria-label={key === 'Backspace' ? 'Backspace' : key}
              >
                {key === 'Backspace' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
