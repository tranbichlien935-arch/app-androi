import { Colors } from '@/constants/Colors';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function WeightChart({ data, startWeight, targetWeight }) {
    const screenWidth = Dimensions.get('window').width;

    // Prepare chart data
    const chartData = {
        labels: data.labels || [],
        datasets: [
            {
                data: data.values || [0],
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // green
                strokeWidth: 3,
            },
        ],
    };

    // Add target line if available
    if (targetWeight && data.values && data.values.length > 0) {
        chartData.datasets.push({
            data: Array(data.values.length).fill(targetWeight),
            color: (opacity = 1) => `rgba(239, 68, 68, ${opacity * 0.5})`, // red dashed
            strokeWidth: 2,
            withDots: false,
        });
    }

    const chartConfig = {
        backgroundColor: Colors.white,
        backgroundGradientFrom: Colors.white,
        backgroundGradientTo: Colors.white,
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: Colors.green[600],
            fill: Colors.white,
        },
        propsForBackgroundLines: {
            strokeDasharray: '', // solid lines
            stroke: Colors.gray[200],
            strokeWidth: 1,
        },
    };

    // Check if we have valid data
    const hasData = data.values && data.values.length > 0 && data.values.some(v => v > 0);

    if (!hasData) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Chưa có dữ liệu cân nặng</Text>
                <Text style={styles.emptySubtext}>Thêm cân nặng để xem biểu đồ</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>📊 Biến đổi cân nặng</Text>
                <Text style={styles.subtitle}>7 ngày gần nhất</Text>
            </View>

            <LineChart
                data={chartData}
                width={screenWidth - 48}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                fromZero={false}
                segments={4}
            />

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: Colors.green[600] }]} />
                    <Text style={styles.legendText}>Cân nặng thực tế</Text>
                </View>
                {targetWeight && (
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: Colors.red[500], opacity: 0.5 }]} />
                        <Text style={styles.legendText}>Mục tiêu ({targetWeight}kg)</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: Colors.gray[500],
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 12,
        color: Colors.gray[600],
    },
    emptyContainer: {
        backgroundColor: Colors.gray[50],
        borderRadius: 16,
        padding: 32,
        marginHorizontal: 16,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.gray[200],
        borderStyle: 'dashed',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[600],
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        color: Colors.gray[500],
    },
});
