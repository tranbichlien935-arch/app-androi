import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

export const StreakCounter = ({ streak, size = 'medium' }) => {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (streak > 0) {
            // Pulse animation
            scale.value = withSequence(
                withSpring(1.2),
                withSpring(1)
            );

            // Wiggle animation
            rotation.value = withSequence(
                withTiming(-10, { duration: 100 }),
                withTiming(10, { duration: 100 }),
                withTiming(-10, { duration: 100 }),
                withTiming(0, { duration: 100 })
            );
        }
    }, [streak]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotation.value}deg` },
        ],
    }));

    const getSize = () => {
        switch (size) {
            case 'small':
                return { icon: 20, text: 14 };
            case 'large':
                return { icon: 40, text: 24 };
            default:
                return { icon: 28, text: 18 };
        }
    };

    const sizes = getSize();

    const getColor = () => {
        if (streak >= 100) return '#dc2626'; // Red for 100+
        if (streak >= 30) return '#ea580c'; // Orange for 30+
        if (streak >= 7) return '#f59e0b'; // Amber for 7+
        return '#94a3b8'; // Gray for < 7
    };

    if (streak === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Animated.Text style={[animatedStyle, { fontSize: sizes.icon }]}>
                🔥
            </Animated.Text>
            <Text style={[styles.streakText, { fontSize: sizes.text, color: getColor() }]}>
                {streak}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    streakText: {
        fontWeight: '700',
    },
});

