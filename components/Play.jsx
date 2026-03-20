import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

export default function Play({ onPress }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
            friction: 4,
            tension: 200,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 4,
            tension: 200,
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
                <Text style={styles.text}>PLAY</Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#FF3B30',
        paddingVertical: 18,
        paddingHorizontal: 64,
        borderRadius: 36,
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#FF7069',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});
