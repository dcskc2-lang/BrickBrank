import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

export const Grid = ({ board, onGridLayout, hoverState }) => {
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
      {board.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((cellColor, colIndex) => {
            const hoverColor = getHoverColor(rowIndex, colIndex);
            
            return (
              <View
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  { 
                    backgroundColor: cellColor === '0' 
                      ? (hoverColor || '#2c3e50') // Nếu có ghost thì hiện màu, không thì hiện màu nền
                      : cellColor,
                    opacity: (cellColor === '0' && hoverColor) ? 0.3 : 1 // Opacity làm mờ bóng ghost
                  }
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

export const CELL_SIZE = 40; 

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
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 1,
    borderRadius: 4,
  },
});
