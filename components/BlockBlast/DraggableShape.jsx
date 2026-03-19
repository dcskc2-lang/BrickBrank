import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const DRAG_CELL_SIZE = 30;
// Khoảng cách đẩy khối hình lên cao (tránh ngón tay che khuất)
const FINGER_OFFSET_Y = 100;

export const DraggableShape = ({ shape, onDrop, onDrag, onDragEnd }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);

  // Quan trọng: Reset toạ độ khi shape thay đổi! (Sửa lỗi spawn block dính luôn trên màn hình)
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
    zIndex.value = 0;
  }, [shape, translateX, translateY, scale, zIndex]);

  const handleDragJS = (currX, currY) => {
    if (!shape) return;
    if (onDrag) onDrag(shape, currX, currY);
  };

  const handleDragEndJS = () => {
    if (onDragEnd) onDragEnd();
  };

  const handleDropJS = (endX, endY) => {
    if (!shape) return;
    const success = onDrop(shape, endX, endY);
    if (!success) {
      // Nếu đặt lỗi, nảy về vị trí cũ
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      zIndex.value = 0;
    }
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      zIndex.value = 1000;
      scale.value = withSpring(1.5); 
    })
    .onChange((event) => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
      // Trừ đi FINGER_OFFSET_Y để logic game nhận diện tâm khối hình nằm TÍT BÊN TRÊN ngón tay
      runOnJS(handleDragJS)(event.absoluteX, event.absoluteY - FINGER_OFFSET_Y);
    })
    .onEnd((event) => {
      runOnJS(handleDropJS)(event.absoluteX, event.absoluteY - FINGER_OFFSET_Y);
    })
    .onFinalize(() => {
      // Khi kết thúc thao tác kéo (cho dù drop thành công hay không), cũng làm sạch Ghost Preview
      runOnJS(handleDragEndJS)();
    });

  const animatedStyle = useAnimatedStyle(() => {
    // Khi cầm khối lên (scale thay đổi từ 1 -> 1.5), ta đẩy hình nhảy lên cao
    const pickUpOffset = -FINGER_OFFSET_Y * 2 * (scale.value - 1);

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + pickUpOffset }, 
        { scale: scale.value }
      ],
      zIndex: zIndex.value,
    };
  });

  if (!shape) {
    return <View style={styles.emptyContainer} />;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {shape.blocks.map((row, rIdx) => (
          <View key={`r-${rIdx}`} style={styles.row}>
            {row.map((cell, cIdx) => (
              <View
                key={`c-${cIdx}`}
                style={[
                  styles.cell,
                  { backgroundColor: cell === 1 ? shape.color : 'transparent' }
                ]}
              />
            ))}
          </View>
        ))}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    width: 60,
    height: 60,
  },
  container: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: DRAG_CELL_SIZE,
    height: DRAG_CELL_SIZE,
    margin: 1,
    borderRadius: 4,
  },
});
