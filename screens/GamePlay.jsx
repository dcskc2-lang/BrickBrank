import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Grid, CELL_SIZE } from '../components/BlockBlast/Grid';
import { DraggableShape } from '../components/BlockBlast/DraggableShape';
import { 
  createEmptyBoard, 
  getRandomShapes, 
  BOARD_SIZE, 
  canPlaceShape,
  placeShape,
  checkAndClearLines,
  checkGameOver
} from '../components/BlockBlast/GameLogic';

export default function GamePlay() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [availableShapes, setAvailableShapes] = useState(getRandomShapes(3));
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gridPos, setGridPos] = useState({ pageX: 0, pageY: 0, width: 0, height: 0 });
  const [hoverState, setHoverState] = useState(null); // { shape, row, col }

  const onGridLayout = (x, y, w, h, pageX, pageY) => {
    setGridPos({ pageX, pageY, width: w, height: h });
  };

  // Logic gọi liên tục mỗi khi ngón tay di chuyển để dò xem có hợp lệ nhét vào Grid không (để hiện Ghost Preview)
  const handleDragShape = useCallback((shape, currentX, currentY) => {
    if (isGameOver) return;
    if (!gridPos.width) return; // Grid chưa load xong

    // Xem ngón tay có đang dạo quanh Grid không
    if (
      currentX >= gridPos.pageX &&
      currentX <= gridPos.pageX + gridPos.width &&
      currentY >= gridPos.pageY &&
      currentY <= gridPos.pageY + gridPos.height
    ) {
      const gridX = currentX - gridPos.pageX;
      const gridY = currentY - gridPos.pageY;
      
      const shapeWidth = shape.blocks[0].length * CELL_SIZE;
      const shapeHeight = shape.blocks.length * CELL_SIZE;
      
      const topLeftX = gridX - (shapeWidth / 2);
      const topLeftY = gridY - (shapeHeight / 2);

      const col = Math.round(topLeftX / CELL_SIZE);
      const row = Math.round(topLeftY / CELL_SIZE);

      if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
        if (canPlaceShape(board, shape, row, col)) {
          setHoverState({ shape, row, col });
          return;
        }
      }
    }
    
    // Nếu trượt ra ngoài, ẩn bóng đi
    setHoverState(null);
  }, [board, gridPos, isGameOver]);

  const handleDragEnd = useCallback(() => {
    setHoverState(null);
  }, []);

  const handleDropShape = useCallback((shape, releaseX, releaseY) => {
    if (isGameOver) return false;
    setHoverState(null); // Tuột tay khỏi màn là dọn bóng luôn

    if (
      releaseX >= gridPos.pageX &&
      releaseX <= gridPos.pageX + gridPos.width &&
      releaseY >= gridPos.pageY &&
      releaseY <= gridPos.pageY + gridPos.height
    ) {
      const gridX = releaseX - gridPos.pageX;
      const gridY = releaseY - gridPos.pageY;
      
      const shapeWidth = shape.blocks[0].length * CELL_SIZE;
      const shapeHeight = shape.blocks.length * CELL_SIZE;
      
      const topLeftX = gridX - (shapeWidth / 2);
      const topLeftY = gridY - (shapeHeight / 2);

      const col = Math.round(topLeftX / CELL_SIZE);
      const row = Math.round(topLeftY / CELL_SIZE);

      if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
        if (canPlaceShape(board, shape, row, col)) {
          let newBoard = placeShape(board, shape, row, col);
          
          const shapeScore = shape.blocks.flat().filter(x => x === 1).length * 1;

          const clearedResult = checkAndClearLines(newBoard);
          newBoard = clearedResult.newBoard;
          const currentScore = score + shapeScore + clearedResult.points;
          setBoard(newBoard);
          setScore(currentScore);

          const nextShapes = [...availableShapes];
          const shapeIndex = nextShapes.findIndex(s => s && s.uid === shape.uid);
          if (shapeIndex !== -1) {
            nextShapes[shapeIndex] = null;
          }

          // Thay mới nếu dùng xong cả 3 block
          if (nextShapes.every(s => s === null)) {
            const newRandomShapes = getRandomShapes(3);
            setAvailableShapes(newRandomShapes);
            if (checkGameOver(newBoard, newRandomShapes)) {
              setIsGameOver(true);
            }
          } else {
            setAvailableShapes(nextShapes);
            if (checkGameOver(newBoard, nextShapes)) {
              setIsGameOver(true);
            }
          }

          return true; // Bỏ đúng ô thành công
        }
      }
    }

    return false; // Thất bại
  }, [board, availableShapes, score, gridPos, isGameOver]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setAvailableShapes(getRandomShapes(3));
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>BLOCK BLAST</Text>
      <Text style={styles.scoreText}>Điểm: {score}</Text>

      <View style={styles.boardContainer}>
        {/* Render Grid cùng với bóng do ngón tay rê */}
        <Grid board={board} onGridLayout={onGridLayout} hoverState={hoverState} />
        
        {isGameOver && (
          <View style={styles.gameOverOverlay}>
            <Text style={styles.gameOverText}>Game Over!</Text>
            <TouchableOpacity style={styles.restartBtn} onPress={resetGame}>
              <Text style={styles.restartBtnText}>Chơi Lại</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.shapesContainer}>
        {availableShapes.map((shape, index) => (
          // Dùng key = rank id + index để tránh tái sử dụng sai component khi render
          <View key={`shape-slot-${index}-${shape?.uid || 'null'}`} style={styles.shapeSlot}>
             <DraggableShape 
                shape={shape} 
                onDrop={handleDropShape} 
                onDrag={handleDragShape}
                onDragEnd={handleDragEnd}
              />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e272e', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#00BCD4', marginBottom: 5 },
  scoreText: { fontSize: 50, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  boardContainer: { marginVertical: 10, position: 'relative', backgroundColor: '#2C3A47', padding: 8, borderRadius: 10, elevation: 5 },
  shapesContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: 150, marginTop: 30, paddingHorizontal: 10 },
  shapeSlot: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  gameOverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  gameOverText: { fontSize: 40, fontWeight: 'bold', color: '#E91E63', marginBottom: 20 },
  restartBtn: { backgroundColor: '#00BCD4', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20, elevation: 3 },
  restartBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
