import React from 'react';
import Tile from './Tile';
import './Grid.css';

const Grid = ({ guesses, currentGuess, currentRow }) => {
  const totalRows = 6;
  const totalCols = 5;

  return (
    <div className="grid">
      {Array.from({ length: totalRows }, (_, rowIndex) => (
        <div className="grid-row" key={`row-${rowIndex}`}>
          {Array.from({ length: totalCols }, (_, colIndex) => {
            if (rowIndex < currentRow) {
              const guessObj = guesses[rowIndex];
              const letter = guessObj.guess[colIndex] || '';
              const status = guessObj.status[colIndex] || '';
              return (
                <Tile
                  key={`tile-${rowIndex}-${colIndex}`}
                  letter={letter}
                  status={status}
                />
              );
            } else if (rowIndex === currentRow) {
              const letter = currentGuess[colIndex] || '';
              return (
                <Tile
                  key={`tile-${rowIndex}-${colIndex}`}
                  letter={letter}
                  status=""
                />
              );
            } else {
              return (
                <Tile
                  key={`tile-${rowIndex}-${colIndex}`}
                  letter=""
                  status=""
                />
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
