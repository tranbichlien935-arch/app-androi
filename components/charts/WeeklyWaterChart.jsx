import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

/**
 * Component hiển thị biểu đồ lượng nước tuần
 * @param {Object} props
 * @param {Array<{day: string, amount: number, goal: number}>} props.weeklyData - Dữ liệu 7 ngày
 */
export default function WeeklyWaterChart({ weeklyData = [] }) {
    const screenWidth = Dimensions.get('window').width;
    const chartWidth = screenWidth - 64;

    // Chuẩn bị dữ liệu cho chart
    const labels = weeklyData.length > 0
        ? weeklyData.map(item => item.day)
        : ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    const data = weeklyData.length > 0
        ? weeklyData.map(item => item.amount)
        : [0, 0, 0, 0, 0, 0, 0];

    const chartConfig = {
        backgroundColor: Colors.white,
        backgroundGradientFrom: Colors.white,
        backgroundGradientTo: Colors.white,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: Colors.gray[200],
            strokeWidth: 1,
        },
        barPercentage: 0.7,
    };

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
            },
        ],
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="bar-chart" size={20} color={Colors.gray[700]} />
                <Text style={styles.title}>Tiến độ tuần</Text>
            </View>

            <View style={styles.chartContainer}>
                <BarChart
                    data={chartData}
                    width={chartWidth}
                    height={220}
                    chartConfig={chartConfig}
                    style={styles.chart}
                    withInnerLines={true}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    fromZero={true}
                    showValuesOnTopOfBars={true}
                    yAxisSuffix="ml"
                    segments={4}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        margin: 16,
        marginTop: 0,
        shadowColor: Colors.gray[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    chartContainer: {
        alignItems: 'center',
        marginLeft: -16,
    },
    chart: {
        borderRadius: 16,
    },
});
