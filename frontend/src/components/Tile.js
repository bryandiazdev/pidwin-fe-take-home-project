import React from 'react';
import './Tile.css';

const Tile = ({ letter, status }) => {
  let statusClass = '';
  if (status === '1') statusClass = 'correct';
  else if (status === '0') statusClass = 'present';
  else if (status === 'x') statusClass = 'absent';

  return (
    <div className={`tile ${statusClass}`}>
      {letter.toUpperCase()}
    </div>
  );
};

export default Tile;
