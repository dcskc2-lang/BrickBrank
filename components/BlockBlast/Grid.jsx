import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';

const AnimatedCell = ({ cellColor, cellSize, hoverColor, isClearing }) => {
  const scale = useSharedValue(1);
  
  useEffect(() => {
    if (isClearing) {
       scale.value = withSequence(
         withTiming(1.3, { duration: 150 }),
         withTiming(0, { duration: 150 })
       );
    } else {
       scale.value = 1;
    }
  }, [isClearing, scale]);

  const style = useAnimatedStyle(() => {
    let finalOpacity = 1;
    if (cellColor === '0' && hoverColor) finalOpacity = 0.3;
    if (isClearing) finalOpacity = scale.value > 0.5 ? 1 : scale.value * 2;
    
    return {
      transform: [{ scale: scale.value }],
      opacity: finalOpacity
    };
  });

  return (
    <Animated.View
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: cellColor === '0' ? (hoverColor || '#2c3e50') : cellColor,
        },
        style
      ]}
    />
  );
};

export const Grid = ({ board, onGridLayout, hoverState, cellSize, clearingCells = [] }) => {
  const gridRef = useRef(null);

  useEffect(() => {
    // Measure sau khi mount một chút để đảm bảo UI đã render xong
    const timer = setTimeout(() => {
      if (gridRef.current) {
        gridRef.current.measure((x, y, width, height, pageX, pageY) => {
          onGridLayout(x, y, width, height, pageX, pageY);
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [onGridLayout]);

  // Hàm phụ trợ xem ô này có bị đè bởi Ghost Preview không
  const getHoverColor = (r, c) => {
    if (!hoverState) return null;
    const { shape, row, col } = hoverState;
    const rOffset = r - row;
    const cOffset = c - col;
    
    // Nếu nằm trong phạm vi 2D mảng của khối hình
    if (
      rOffset >= 0 && rOffset < shape.blocks.length &&
      cOffset >= 0 && cOffset < shape.blocks[0].length
    ) {
      if (shape.blocks[rOffset][cOffset] === 1) {
        return shape.color;
      }
    }
    return null;
  };

  return (
    <View 
      style={styles.gridContainer}
      ref={gridRef}
    >
      {board.map((rowArr, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {rowArr.map((cellColor, colIndex) => {
            const hoverColor = getHoverColor(rowIndex, colIndex);
            const isClearing = clearingCells.some(cell => cell.r === rowIndex && cell.c === colIndex);
            
            return (
              <AnimatedCell
                key={`cell-${rowIndex}-${colIndex}`}
                cellColor={cellColor}
                cellSize={cellSize}
                hoverColor={hoverColor}
                isClearing={isClearing}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: '#34495e',
    padding: 4,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    margin: 1,
    borderRadius: 4,
  },
});
