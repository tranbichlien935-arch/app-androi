import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function WeeklyActivityChart({ weeklyData = [] }) {
    const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week' or 'month'

    // Prepare chart data
    const chartData = {
        labels: selectedPeriod === 'week'
            ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
            : ['T1', 'T2', 'T3', 'T4'],
        datasets: [{
            data: weeklyData.length > 0
                ? weeklyData
                : [0, 0, 0, 0, 0, 0, 0],
            color: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`,
            strokeWidth: 3,
        }],
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Hoạt động trong tuần</Text>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            selectedPeriod === 'week' && styles.toggleButtonActive,
                        ]}
                        onPress={() => setSelectedPeriod('week')}
                    >
                        <Text
                            style={[
                                styles.toggleText,
                                selectedPeriod === 'week' && styles.toggleTextActive,
                            ]}
                        >
                            Tuần
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            selectedPeriod === 'month' && styles.toggleButtonActive,
                        ]}
                        onPress={() => setSelectedPeriod('month')}
                    >
                        <Text
                            style={[
                                styles.toggleText,
                                selectedPeriod === 'month' && styles.toggleTextActive,
                            ]}
                        >
                            Tháng
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <LineChart
                data={chartData}
                width={screenWidth - 64}
                height={200}
                chartConfig={{
                    backgroundColor: Colors.white,
                    backgroundGradientFrom: '#f3e8ff',
                    backgroundGradientTo: '#f3e8ff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: '4',
                        strokeWidth: '2',
                        stroke: '#a855f7',
                    },
                    propsForBackgroundLines: {
                        strokeDasharray: '',
                        stroke: '#e5e7eb',
                        strokeWidth: 1,
                    },
                }}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 16,
        marginTop: 0,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.gray[100],
        borderRadius: 8,
        padding: 2,
    },
    toggleButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 6,
    },
    toggleButtonActive: {
        backgroundColor: '#a855f7',
    },
    toggleText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.gray[600],
    },
    toggleTextActive: {
        color: Colors.white,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});
