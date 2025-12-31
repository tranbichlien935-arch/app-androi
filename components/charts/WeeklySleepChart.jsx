import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

/**
 * Component hiển thị biểu đồ lịch sử giấc ngủ tuần
 * @param {Object} props
 * @param {Array<{day: string, hours: number}>} props.weeklyData - Dữ liệu 7 ngày
 */
export default function WeeklySleepChart({ weeklyData = [] }) {
    const screenWidth = Dimensions.get('window').width;
    const chartWidth = screenWidth - 64; // margin 16 * 2 + padding 16 * 2

    // Chuẩn bị dữ liệu cho chart
    const labels = weeklyData.length > 0
        ? weeklyData.map(item => item.day)
        : ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    const data = weeklyData.length > 0
        ? weeklyData.map(item => item.hours)
        : [0, 0, 0, 0, 0, 0, 0];

    const chartConfig = {
        backgroundColor: Colors.white,
        backgroundGradientFrom: Colors.white,
        backgroundGradientTo: Colors.white,
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: Colors.purple[500],
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: Colors.gray[200],
            strokeWidth: 1,
        },
    };

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                strokeWidth: 3,
            },
        ],
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="trending-up" size={20} color={Colors.gray[700]} />
                <Text style={styles.title}>Lịch sử tuần</Text>
            </View>

            <View style={styles.chartContainer}>
                <LineChart
                    data={chartData}
                    width={chartWidth}
                    height={200}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withInnerLines={true}
                    withOuterLines={true}
                    withVerticalLines={false}
                    withHorizontalLines={true}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    fromZero={true}
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
