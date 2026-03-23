import {
  createEmptyBoard,
  canPlaceShape,
  placeShape,
  checkAndClearLines,
  checkGameOver,
  SHAPES
} from '../components/BlockBlast/GameLogic';

describe('Kiểm thử Block Blast GameLogic', () => {

  test('TC-01: createEmptyBoard(8) trả về mảng 8x8 chứa toàn "0"', () => {
    const board = createEmptyBoard(8);
    expect(board.length).toBe(8);
    expect(board[0].length).toBe(8);
    expect(board[0][0]).toBe('0');
  });

  test('TC-02: canPlaceShape trả về true khi đặt khối shape trên bảng rỗng ở (0,0)', () => {
    const board = createEmptyBoard(8);
    const shape = SHAPES[0]; // dot shape
    expect(canPlaceShape(board, shape, 0, 0, 8)).toBe(true);
  });

  test('TC-03: canPlaceShape trả về false khi đặt hình ra ngoài biên (Out of bounds)', () => {
    const board = createEmptyBoard(8);
    const shape = SHAPES[1]; // square 2x2
    expect(canPlaceShape(board, shape, 7, 7, 8)).toBe(false);
  });

  test('TC-04: checkAndClearLines thực hiện xóa hàng khi hàng chứa đầy block', () => {
    let board = createEmptyBoard(8);
    // Lấp đầy hàng 0
    board[0] = Array(8).fill('#FF5722');
    
    const result = checkAndClearLines(board, 8);
    expect(result.linesCleared).toBe(1);
    expect(result.newBoard[0][0]).toBe('0'); // Đã bị xóa
  });

  test('TC-05: checkGameOver trả về true khi không thể đặt được hình nào nữa', () => {
    // Tạo một board bị lấp đầy
    let board = Array.from({ length: 8 }, () => Array(8).fill('#FF5722'));
    const shapes = [SHAPES[1], SHAPES[2]]; // Các khối to hơn 1 ô trống (bảng đã đầy)
    expect(checkGameOver(board, shapes, 8)).toBe(true);
  });

});
