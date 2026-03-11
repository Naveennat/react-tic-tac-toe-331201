import React, { useState, useEffect } from 'react';
import './App.css';

/*
  PUBLIC_INTERFACE
  Main App component for Tic Tac Toe.
  - Renders a central board (3x3 grid)
  - Supports two-player local play (X & O)
  - Shows current/next player, winner or draw message
  - Provides a styled Restart Game button
  - Fully responsive and uses the required color palette
 */
function App() {
  // Initialize board as 9-element array of nulls for empty squares
  const [board, setBoard] = useState(Array(9).fill(null));
  // X always starts the game
  const [xIsNext, setXIsNext] = useState(true);
  // Holds winner ('X'/'O'/null) or 'draw'
  const [status, setStatus] = useState({ winner: null, isDraw: false });

  // Effect: Check on board change if game has been won or is a draw
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setStatus({ winner, isDraw: false });
    } else if (board.every(square => square !== null)) {
      setStatus({ winner: null, isDraw: true });
    } else {
      setStatus({ winner: null, isDraw: false });
    }
  }, [board]);

  // PUBLIC_INTERFACE
  // Handles click on a square
  function handleSquareClick(idx) {
    // Do nothing if occupied or game is over
    if (board[idx] !== null || status.winner || status.isDraw) return;
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  // Resets the board and player state
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setStatus({ winner: null, isDraw: false });
  }

  // Returns status message
  function getStatusMessage() {
    if (status.winner) {
      return <>Winner: <span className={`player player-${status.winner}`}>{status.winner}</span></>;
    }
    if (status.isDraw) {
      return <>It's a <span className="draw">draw!</span></>;
    }
    return <>Next player: <span className={`player player-${xIsNext ? 'X' : 'O'}`}>{xIsNext ? 'X' : 'O'}</span></>;
  }

  // Renders a square of the board
  function Square({ value, onClick, highlight }) {
    return (
      <button
        className={`ttt-square${highlight ? ' highlight' : ''}`}
        onClick={onClick}
        aria-label={value ? `Square: ${value}` : 'Empty square'}
      >
        {value}
      </button>
    );
  }

  // Get win line to highlight, if any
  const winLine = getWinningLine(board);

  // Main render
  return (
    <div className="ttt-app-bg">
      <main className="ttt-main-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status" role="status">{getStatusMessage()}</div>
        <section className="ttt-board-container">
          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {board.map((value, idx) => (
              <Square
                key={idx}
                value={value}
                onClick={() => handleSquareClick(idx)}
                highlight={winLine && winLine.includes(idx)}
              />
            ))}
          </div>
        </section>
        <button
          className="ttt-restart-btn"
          onClick={handleRestart}
          aria-label="Restart game"
        >
          Restart Game
        </button>
        <footer className="ttt-footer">
          <span>Modern UI • <span style={{ color: '#3b82f6' }}>#3b82f6</span> &amp; <span style={{ color: '#06b6d4' }}>#06b6d4</span> accents</span>
        </footer>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
// Returns 'X', 'O', or null if no winner yet
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// Returns array of indices for the winning line for highlight, or null
function getWinningLine(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return null;
}

export default App;
