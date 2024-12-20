import React, { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import axios from 'axios';
import './App.css';

const App = () => {
  const [guesses, setGuesses] = useState([]);

  const [currentGuess, setCurrentGuess] = useState([]);

  const [currentRow, setCurrentRow] = useState(0);

  const [gameOver, setGameOver] = useState(false);

  const [isWin, setIsWin] = useState(false);

  const [keyStatuses, setKeyStatuses] = useState({});

  const [errorMessage, setErrorMessage] = useState('');

  /**
   * @param {string} key
   */
  const handleKeyPress = useCallback(
    (key) => {
      if (gameOver) return;

      if (key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (key === 'Enter') {
        if (currentGuess.length === 5) {
          submitGuess(currentGuess.join('').toLowerCase());
        }
      } else {
        if (currentGuess.length < 5) {
          setCurrentGuess((prev) => [...prev, key.toLowerCase()]);
        }
      }
    },
    [currentGuess, gameOver]
  );

  /**
   * @param {string} guess
   */
  const submitGuess = async (guess) => {
    try {
      const response = await axios.get('http://localhost:5000/api/word', {
        params: { guess },
      });

      const { result, success } = response.data;

      if (!result || result.length !== 5) {
        throw new Error('Invalid response format from backend');
      }

      const lettersStatus = result.split('');

      setGuesses((prev) => [...prev, { guess, status: lettersStatus }]);

      updateKeyStatuses(guess, lettersStatus);

      setCurrentGuess([]);

      setCurrentRow((prev) => prev + 1);

      const isCompleteWin = lettersStatus.every((status) => status === '1');

      if (isCompleteWin) {
        setIsWin(true);
        setGameOver(true);
      }

      if (currentRow + 1 >= 6 && !isCompleteWin) {
        setIsWin(false);
        setGameOver(true);
      }

      setErrorMessage('');
    } catch (error) {
      console.error('Error submitting guess:', error);
      setErrorMessage('Invalid guess. Please try again.');
    }
  };

  /**
   * @param {string} guess
   * @param {Array} lettersStatus
   */
  const updateKeyStatuses = (guess, lettersStatus) => {
    const newKeyStatuses = { ...keyStatuses };

    guess.split('').forEach((letter, index) => {
      const status = lettersStatus[index];
      const upperLetter = letter.toUpperCase();

      if (status === '1') {
        newKeyStatuses[upperLetter] = 'correct';
      } else if (status === '0') {
        if (newKeyStatuses[upperLetter] !== 'correct') {
          newKeyStatuses[upperLetter] = 'present';
        }
      } else if (status === 'x') {
        if (!newKeyStatuses[upperLetter]) {
          newKeyStatuses[upperLetter] = 'absent';
        }
      }
    });

    setKeyStatuses(newKeyStatuses);
  };

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess([]);
    setCurrentRow(0);
    setGameOver(false);
    setIsWin(false);
    setKeyStatuses({});
    setErrorMessage('');
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (gameOver) return;

      if (key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (key === 'Enter') {
        if (currentGuess.length === 5) {
          submitGuess(currentGuess.join('').toLowerCase());
        }
      } else if (/^[a-zA-Z]$/.test(key)) {
        if (currentGuess.length < 5) {
          setCurrentGuess((prev) => [...prev, key.toLowerCase()]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentGuess, gameOver]);

  return (
    <div className="app">
      <header>
        <h1>Wordle</h1>
      </header>

      <Grid guesses={guesses} currentGuess={currentGuess} currentRow={currentRow} />

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!gameOver && (
        <>
          <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} />
          <button
            disabled={currentGuess.length !== 5}
            onClick={() => submitGuess(currentGuess.join('').toLowerCase())}
            className="guess-button"
          >
            Guess Word
          </button>
        </>
      )}

      {gameOver && (
        <div className="game-over-message">
          {isWin ? (
            <>
              <p>🎉 Congratulations! You guessed the word!</p>
              <button onClick={resetGame} className="reset-button">
                Play Again
              </button>
            </>
          ) : (
            <>
              <p>😞 Game Over! Better luck next time.</p>
              <button onClick={resetGame} className="reset-button">
                Play Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
