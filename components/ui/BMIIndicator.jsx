import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

export default function BMIIndicator({ bmi, height }) {
    // BMI Categories
    const categories = [
        { label: 'Thiếu cân', min: 0, max: 18.5, color: '#3b82f6' }, // blue
        { label: 'Bình thường', min: 18.5, max: 25, color: '#22c55e' }, // green
        { label: 'Thừa cân', min: 25, max: 30, color: '#f59e0b' }, // amber
        { label: 'Béo phì', min: 30, max: 50, color: '#ef4444' }, // red
    ];

    // Determine current category
    const getCurrentCategory = () => {
        return categories.find(cat => bmi >= cat.min && bmi < cat.max) || categories[0];
    };

    const currentCategory = getCurrentCategory();

    // Calculate position on the bar (0-100%)
    const getIndicatorPosition = () => {
        if (bmi < 15) return 0;
        if (bmi > 35) return 100;
        // Map BMI 15-35 to 0-100%
        return ((bmi - 15) / 20) * 100;
    };

    const indicatorPosition = getIndicatorPosition();

    if (!bmi || bmi <= 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>📊 Chỉ số BMI</Text>
                </View>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Chưa có dữ liệu BMI</Text>
                    <Text style={styles.emptySubtext}>
                        {!height || height <= 0
                            ? 'Vui lòng cập nhật chiều cao trong Profile'
                            : 'Thêm cân nặng để tính BMI'}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>📊 Chỉ số BMI</Text>
                {height > 0 && (
                    <Text style={styles.heightText}>Chiều cao: {height} cm</Text>
                )}
            </View>

            {/* BMI Value */}
            <View style={styles.bmiValueContainer}>
                <Text style={[styles.bmiValue, { color: currentCategory.color }]}>
                    {bmi.toFixed(1)}
                </Text>
                <Text style={styles.bmiLabel}>{currentCategory.label}</Text>
            </View>

            {/* Color Bar */}
            <View style={styles.barContainer}>
                <View style={styles.colorBar}>
                    {categories.map((cat, index) => (
                        <View
                            key={index}
                            style={[
                                styles.colorSegment,
                                { backgroundColor: cat.color },
                            ]}
                        />
                    ))}
                </View>

                {/* Indicator */}
                <View
                    style={[
                        styles.indicator,
                        { left: `${indicatorPosition}%` },
                    ]}
                >
                    <View style={styles.indicatorDot} />
                    <View style={styles.indicatorLine} />
                </View>
            </View>

            {/* Labels */}
            <View style={styles.labelsContainer}>
                <Text style={styles.labelText}>15</Text>
                <Text style={styles.labelText}>18.5</Text>
                <Text style={styles.labelText}>25</Text>
                <Text style={styles.labelText}>30</Text>
                <Text style={styles.labelText}>35</Text>
            </View>

            {/* Category Labels */}
            <View style={styles.categoriesContainer}>
                {categories.map((cat, index) => (
                    <View key={index} style={styles.categoryItem}>
                        <View
                            style={[
                                styles.categoryDot,
                                { backgroundColor: cat.color },
                            ]}
                        />
                        <Text style={styles.categoryLabel}>{cat.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 16,
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
    heightText: {
        fontSize: 12,
        color: Colors.gray[500],
    },
    bmiValueContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    bmiValue: {
        fontSize: 48,
        fontWeight: '700',
        marginBottom: 4,
    },
    bmiLabel: {
        fontSize: 16,
        color: Colors.gray[600],
    },
    barContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    colorBar: {
        flexDirection: 'row',
        height: 12,
        borderRadius: 6,
        overflow: 'hidden',
    },
    colorSegment: {
        flex: 1,
    },
    indicator: {
        position: 'absolute',
        top: -8,
        transform: [{ translateX: -6 }],
        alignItems: 'center',
    },
    indicatorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.gray[900],
        borderWidth: 2,
        borderColor: Colors.white,
    },
    indicatorLine: {
        width: 2,
        height: 20,
        backgroundColor: Colors.gray[900],
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    labelText: {
        fontSize: 11,
        color: Colors.gray[500],
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    categoryDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    categoryLabel: {
        fontSize: 12,
        color: Colors.gray[600],
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 24,
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
        textAlign: 'center',
    },
});
