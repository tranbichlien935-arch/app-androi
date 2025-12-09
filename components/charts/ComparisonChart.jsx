import { useThemeColor } from '@/hooks/use-theme-color';
import { Habit } from '@/types/habit';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

export const ComparisonChart = ({ habits }) => {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint');

    const screenWidth = Dimensions.get('window').width;

    // Get top 5 habits by completion count
    const topHabits = habits
        .map(h => ({
            name: h.name.length > 10 ? h.name.substring(0, 10) + '...' : h.name,
            count: h.history.length,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    if (topHabits.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: textColor }]}>
                    No habits to compare yet
                </Text>
            </View>
        );
    }

    const chartData = {
        labels: topHabits.map(h => h.name),
        datasets: [{
            data: topHabits.map(h => h.count),
        }],
    };

    const chartConfig = {
        backgroundColor: backgroundColor,
        backgroundGradientFrom: backgroundColor,
        backgroundGradientTo: backgroundColor,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        labelColor: (opacity = 1) => textColor,
        style: {
            borderRadius: 16,
        },
        propsForLabels: {
            fontSize: 10,
        },
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: textColor }]}>Top Habits</Text>
            <BarChart
                data={chartData}
                width={screenWidth - 48}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisLabel=""
                yAxisSuffix=""
                fromZero
                showValuesOnTopOfBars
            />
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
    chart: {
        borderRadius: 16,
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        opacity: 0.6,
    },
});

