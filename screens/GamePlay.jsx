import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState, useContext } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DraggableShape } from '../components/BlockBlast/DraggableShape';
import { AudioContext } from '../app/(tabs)/index';
import PauseModal from '../components/BlockBlast/Modals/PauseModal';
import GameOverModal from '../components/BlockBlast/Modals/GameOverModal';
import {
  canPlaceShape,
  checkAndClearLines,
  checkGameOver,
  createEmptyBoard,
  getRandomShapes,
  placeShape
} from '../components/BlockBlast/GameLogic';
import { Grid } from '../components/BlockBlast/Grid';
import BannerAds from '../components/BlockBlast/BannerAds';

const screenWidth = Dimensions.get('window').width;

export default function GamePlay({ route, navigation }) {
  const boardSize = route?.params?.size || 8;
  const CELL_SIZE = Math.min(40, Math.floor((screenWidth - 40) / boardSize));

  const [board, setBoard] = useState(createEmptyBoard(boardSize));
  const [availableShapes, setAvailableShapes] = useState(getRandomShapes(3));
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPauseModalVisible, setPauseModalVisible] = useState(false);
  const [clearingCells, setClearingCells] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const { soundEnabled, toggleSound } = useContext(AudioContext);
  const [gridPos, setGridPos] = useState({ pageX: 0, pageY: 0, width: 0, height: 0 });
  const [hoverState, setHoverState] = useState(null);
  const [playerName, setPlayerName] = useState('');

  const onGridLayout = (x, y, w, h, pageX, pageY) => {
    setGridPos({ pageX, pageY, width: w, height: h });
  };

  const handleDragShape = useCallback((shape, currentX, currentY) => {
    if (isGameOver || isPauseModalVisible || isAnimating) return;
    if (!gridPos.width) return;

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

      if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
        if (canPlaceShape(board, shape, row, col, boardSize)) {
          setHoverState({ shape, row, col });
          return;
        }
      }
    }
    setHoverState(null);
  }, [board, gridPos, isGameOver, isPauseModalVisible, isAnimating, boardSize, CELL_SIZE]);

  const handleDragEnd = useCallback(() => {
    setHoverState(null);
  }, []);

  const handleDropShape = useCallback((shape, releaseX, releaseY) => {
    if (isGameOver || isPauseModalVisible || isAnimating) return false;
    setHoverState(null);

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

      if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
        if (canPlaceShape(board, shape, row, col, boardSize)) {
          let placedBoard = placeShape(board, shape, row, col);
          const shapeScore = shape.blocks.flat().filter(x => x === 1).length * 1;

          const clearedResult = checkAndClearLines(placedBoard, boardSize);

          const processNextMove = (finalBoard) => {
            const nextShapes = [...availableShapes];
            const shapeIndex = nextShapes.findIndex(s => s && s.uid === shape.uid);
            if (shapeIndex !== -1) {
              nextShapes[shapeIndex] = null;
            }

            if (nextShapes.every(s => s === null)) {
              const newRandomShapes = getRandomShapes(3);
              setAvailableShapes(newRandomShapes);
              if (checkGameOver(finalBoard, newRandomShapes, boardSize)) {
                setIsGameOver(true);
              }
            } else {
              setAvailableShapes(nextShapes);
              if (checkGameOver(finalBoard, nextShapes, boardSize)) {
                setIsGameOver(true);
              }
            }
          };

          // Kích hoạt Hiệu ứng Nổ VFX thay vì ăn điểm chớp nhoáng
          if (clearedResult.clearingCells.length > 0) {
            setIsAnimating(true);
            setClearingCells(clearedResult.clearingCells);
            setBoard(placedBoard);

            setTimeout(() => {
              setBoard(clearedResult.newBoard);
              setScore(prev => prev + shapeScore + clearedResult.points);
              setClearingCells([]);
              processNextMove(clearedResult.newBoard);
              setIsAnimating(false);
            }, 300);
          } else {
            setBoard(clearedResult.newBoard);
            setScore(prev => prev + shapeScore);
            processNextMove(clearedResult.newBoard);
          }

          return true;
        }
      }
    }
    return false;
  }, [board, availableShapes, gridPos, isGameOver, isPauseModalVisible, isAnimating, boardSize, CELL_SIZE]);

  const saveScoreAndExit = async () => {
    try {
      if (playerName.trim() !== '') {
        const storedScores = await AsyncStorage.getItem('highScores');
        const scoresArray = storedScores ? JSON.parse(storedScores) : [];
        scoresArray.push({
          name: playerName,
          score: score,
          mode: `${boardSize}x${boardSize}`,
          date: new Date().toISOString()
        });
        scoresArray.sort((a, b) => b.score - a.score);
        await AsyncStorage.setItem('highScores', JSON.stringify(scoresArray));
      }
    } catch (e) { console.log(e); }
    navigation.navigate('Menu');
  };

  const skipAndExit = () => {
    navigation.navigate('Menu');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nút tạm dừng góc trái */}
      <TouchableOpacity style={styles.topLeftBtn} onPress={() => setPauseModalVisible(true)}>
        <Text style={{fontSize: 24}}>⏸</Text>
      </TouchableOpacity>

      <Text style={styles.title}>BLOCK BLAST</Text>
      <Text style={styles.scoreText}>Điểm: {score}</Text>

      <View style={styles.boardContainer}>
        <Grid board={board} onGridLayout={onGridLayout} hoverState={hoverState} cellSize={CELL_SIZE} clearingCells={clearingCells} />

        <GameOverModal 
          visible={isGameOver} 
          playerName={playerName} 
          setPlayerName={setPlayerName} 
          onSave={saveScoreAndExit} 
          onSkip={skipAndExit} 
        />
      </View>

      <View style={styles.shapesContainer}>
        {availableShapes.map((shape, index) => (
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

      <PauseModal 
        visible={isPauseModalVisible} 
        onClose={() => setPauseModalVisible(false)} 
        onExit={() => { setPauseModalVisible(false); navigation.navigate('Menu'); }} 
        soundEnabled={soundEnabled} 
        toggleSound={toggleSound} 
      />
      <BannerAds />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e272e', justifyContent: 'center', alignItems: 'center' },
  topLeftBtn: { position: 'absolute', top: 50, left: 20, width: 45, height: 45, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 25, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#00BCD4', marginBottom: 5 },
  scoreText: { fontSize: 50, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  boardContainer: { marginVertical: 10, position: 'relative', backgroundColor: '#2C3A47', padding: 8, borderRadius: 10, elevation: 5 },
  shapesContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: 150, marginTop: 30, paddingHorizontal: 10 },
  shapeSlot: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center' }
});
