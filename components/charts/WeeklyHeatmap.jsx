import { useThemeColor } from '@/hooks/use-theme-color';
import { getWeekDates } from '@/utils/dateHelpers';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const WeeklyHeatmap = ({ completionData }) => {
    const textColor = useThemeColor({}, 'text');
    const weekDates = getWeekDates();

    const getIntensityColor = (count: number): string => {
        if (count === 0) return '#f1f5f9';
        if (count === 1) return '#bfdbfe';
        if (count === 2) return '#93c5fd';
        if (count === 3) return '#60a5fa';
        return '#3b82f6';
    };

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: textColor }]}>This Week</Text>
            <View style={styles.grid}>
                {weekDates.map((date, index) => {
                    const count = completionData[date] || 0;
                    const color = getIntensityColor(count);

                    return (
                        <View key={date} style={styles.dayContainer}>
                            <Text style={[styles.dayLabel, { color: textColor }]}>
                                {dayLabels[index]}
                            </Text>
                            <View style={[styles.cell, { backgroundColor: color }]}>
                                {count > 0 && (
                                    <Text style={styles.countText}>{count}</Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
            <View style={styles.legend}>
                <Text style={[styles.legendText, { color: textColor }]}>Less</Text>
                {[0, 1, 2, 3, 4].map(level => (
                    <View
                        key={level}
                        style={[styles.legendCell, { backgroundColor: getIntensityColor(level) }]}
                    />
                ))}
                <Text style={[styles.legendText, { color: textColor }]}>More</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    dayContainer: {
        alignItems: 'center',
    },
    dayLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
    },
    cell: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginTop: 8,
    },
    legendText: {
        fontSize: 10,
        opacity: 0.6,
    },
    legendCell: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
});

