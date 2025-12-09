import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

export const ProgressBar = ({ completed, total, showLabel = true }) => {
    const tintColor = useThemeColor({}, 'tint');
    const textColor = useThemeColor({}, 'text');

    const progress = total > 0 ? (completed / total) * 100 : 0;
    const width = useSharedValue(0);

    useEffect(() => {
        width.value = withSpring(progress, {
            damping: 15,
            stiffness: 100,
        });
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${width.value}%`,
    }));

    const getGradientColor = () => {
        if (progress === 100) return '#10b981'; // Green
        if (progress >= 75) return '#3b82f6'; // Blue
        if (progress >= 50) return '#f59e0b'; // Amber
        return '#94a3b8'; // Gray
    };

    return (
        <View style={styles.container}>
            {showLabel && (
                <Text style={[styles.label, { color: textColor }]}>
                    {completed}/{total} habits completed
                </Text>
            )}
            <View style={styles.barContainer}>
                <Animated.View
                    style={[
                        styles.bar,
                        animatedStyle,
                        { backgroundColor: getGradientColor() },
                    ]}
                />
            </View>
            {showLabel && (
                <Text style={[styles.percentage, { color: textColor }]}>
                    {Math.round(progress)}%
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    barContainer: {
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        borderRadius: 4,
    },
    percentage: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
        textAlign: 'right',
    },
});

