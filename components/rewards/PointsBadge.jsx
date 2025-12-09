import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const PointsBadge = ({
    points,
    size = 'medium',
    showLabel = true
}) => {
    const tintColor = useThemeColor({}, 'tint');
    const textColor = useThemeColor({}, 'text');

    const getSize = () => {
        switch (size) {
            case 'small':
                return { icon: 16, text: 12, padding: 6 };
            case 'large':
                return { icon: 28, text: 20, padding: 12 };
            default:
                return { icon: 20, text: 16, padding: 8 };
        }
    };

    const sizes = getSize();

    return (
        <View style={[styles.container, { padding: sizes.padding }]}>
            <Text style={{ fontSize: sizes.icon }}>💎</Text>
            <Text style={[styles.points, { fontSize: sizes.text, color: tintColor }]}>
                {points.toLocaleString()}
            </Text>
            {showLabel && size !== 'small' && (
                <Text style={[styles.label, { color: textColor }]}>points</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#eff6ff',
        borderRadius: 12,
    },
    points: {
        fontWeight: '700',
    },
    label: {
        fontSize: 12,
        opacity: 0.7,
    },
});

