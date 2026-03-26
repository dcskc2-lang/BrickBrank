export const SHAPES = [
  { id: 'dot', color: '#FF5722', blocks: [[1]] },
  { id: 'square-2', color: '#FFEB3B', blocks: [[1, 1], [1, 1]] },
  { id: 'hline-2', color: '#4CAF50', blocks: [[1, 1]] },
  { id: 'vline-2', color: '#4CAF50', blocks: [[1], [1]] },
  { id: 'hline-3', color: '#2196F3', blocks: [[1, 1, 1]] },
  { id: 'vline-3', color: '#2196F3', blocks: [[1], [1], [1]] },
  { id: 'hline-4', color: '#9C27B0', blocks: [[1, 1, 1, 1]] },
  { id: 'vline-4', color: '#9C27B0', blocks: [[1], [1], [1], [1]] },
  { id: 'l-small', color: '#E91E63', blocks: [[1, 0], [1, 1]] },
  { id: 'l-small-flip', color: '#E91E63', blocks: [[0, 1], [1, 1]] },
  { id: 'l-large', color: '#00BCD4', blocks: [[1, 0, 0], [1, 0, 0], [1, 1, 1]] },
];

export const createEmptyBoard = (boardSize = 8) => {
  return Array.from({ length: boardSize }, () => Array(boardSize).fill('0'));
};

export const canPlaceShape = (board, shape, startRow, startCol, boardSize = 8) => {
  const blocks = shape.blocks;
  for (let r = 0; r < blocks.length; r++) {
    for (let c = 0; c < blocks[r].length; c++) {
      if (blocks[r][c] === 1) {
        const boardRow = startRow + r;
        const boardCol = startCol + c;

        if (
          boardRow < 0 ||
          boardRow >= boardSize ||
          boardCol < 0 ||
          boardCol >= boardSize
        ) {
          return false;
        }

        if (board[boardRow][boardCol] !== '0') {
          return false;
        }
      }
    }
  }
  return true;
};

export const placeShape = (board, shape, startRow, startCol) => {
  const newBoard = board.map((row) => [...row]);
  const blocks = shape.blocks;

  for (let r = 0; r < blocks.length; r++) {
    for (let c = 0; c < blocks[r].length; c++) {
      if (blocks[r][c] === 1) {
        newBoard[startRow + r][startCol + c] = shape.color;
      }
    }
  }
  return newBoard;
};

export const checkAndClearLines = (board, boardSize = 8) => {
  let newBoard = board.map((row) => [...row]);
  let rowsToClear = [];
  let colsToClear = [];

  for (let r = 0; r < boardSize; r++) {
    if (newBoard[r].every((cell) => cell !== '0')) rowsToClear.push(r);
  }

  for (let c = 0; c < boardSize; c++) {
    let isFull = true;
    for (let r = 0; r < boardSize; r++) {
      if (newBoard[r][c] === '0') {
        isFull = false;
        break;
      }
    }
    if (isFull) colsToClear.push(c);
  }

  const clearingCells = [];
  let goldBlocksCleared = 0;

  for (const r of rowsToClear) {
    for (let c = 0; c < boardSize; c++) {
      if (newBoard[r][c] === '#fbbf24') goldBlocksCleared++;
      newBoard[r][c] = '0';
      clearingCells.push({ r, c });
    }
  }

  for (const c of colsToClear) {
    for (let r = 0; r < boardSize; r++) {
      if (newBoard[r][c] === '#fbbf24' && !clearingCells.some(cell => cell.r === r && cell.c === c)) {
        goldBlocksCleared++;
      }
      newBoard[r][c] = '0';
      if (!clearingCells.some(cell => cell.r === r && cell.c === c)) {
        clearingCells.push({ r, c });
      }
    }
  }

  const linesCleared = rowsToClear.length + colsToClear.length;
  const points = linesCleared > 0 ? linesCleared * 10 * linesCleared : 0;

  return { newBoard, linesCleared, points, clearingCells, goldBlocksCleared };
};

export const checkGameOver = (board, availableShapes, boardSize = 8) => {
  const activeShapes = availableShapes.filter((s) => s !== null);
  if (activeShapes.length === 0) return false;

  for (const shape of activeShapes) {
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (canPlaceShape(board, shape, r, c, boardSize)) {
          return false;
        }
      }
    }
  }

  return true;
};

export const getRandomShapes = (count = 3) => {
  const selected = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * SHAPES.length);
    let shapeColor = SHAPES[randomIndex].color;
    
    // 15% chance for a shape to turn into a Gold Block
    if (Math.random() < 0.15) {
      shapeColor = '#fbbf24';
    }

    selected.push({
      ...SHAPES[randomIndex],
      color: shapeColor,
      uid: Math.random().toString(36).substring(2, 11)
    });
  }
  return selected;
};
