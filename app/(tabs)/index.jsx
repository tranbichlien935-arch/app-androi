import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data
  const weeklyData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        data: [8234, 10542, 7890, 12340, 9876, 11234, 6543],
      },
    ],
  };

  const todayStats = {
    steps: 8234,
    stepsGoal: 10000,
    calories: 320,
    caloriesGoal: 500,
    water: 1600,
    waterGoal: 2000,
    sleep: 7.5,
    sleepGoal: 8,
  };

  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <LinearGradient
        colors={Colors.gradient.purpleGreen}
        style={styles.welcomeCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.welcomeGreeting}>Xin chào, Nguyễn Văn A</Text>
            <Text style={styles.welcomeTitle}>Hôm nay bạn thế nào?</Text>
          </View>
          <Ionicons name="trophy" size={48} color="rgba(255,255,255,0.9)" />
        </View>

        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>Mục tiêu hôm nay</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${calculateProgress(
                      todayStats.steps,
                      todayStats.stepsGoal
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(
                calculateProgress(todayStats.steps, todayStats.stepsGoal)
              )}
              %
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        {/* Steps Card */}
        <View style={[styles.statCard, styles.statCardOrange]}>
          <View style={styles.statHeader}>
            <LinearGradient
              colors={Colors.gradient.orange}
              style={styles.statIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="footsteps" size={20} color={Colors.white} />
            </LinearGradient>
            <Text style={styles.statLabel}>Bước chân</Text>
          </View>
          <Text style={styles.statValue}>{todayStats.steps.toLocaleString()}</Text>
          <Text style={styles.statGoal}>
            Mục tiêu: {todayStats.stepsGoal.toLocaleString()}
          </Text>
          <View style={styles.miniProgressBg}>
            <View
              style={[
                styles.miniProgressFill,
                styles.miniProgressOrange,
                {
                  width: `${calculateProgress(
                    todayStats.steps,
                    todayStats.stepsGoal
                  )}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Calories Card */}
        <View style={[styles.statCard, styles.statCardRed]}>
          <View style={styles.statHeader}>
            <LinearGradient
              colors={Colors.gradient.red}
              style={styles.statIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="flame" size={20} color={Colors.white} />
            </LinearGradient>
            <Text style={styles.statLabel}>Calo đốt</Text>
          </View>
          <Text style={styles.statValue}>{todayStats.calories} kcal</Text>
          <Text style={styles.statGoal}>
            Mục tiêu: {todayStats.caloriesGoal} kcal
          </Text>
          <View style={styles.miniProgressBg}>
            <View
              style={[
                styles.miniProgressFill,
                styles.miniProgressRed,
                {
                  width: `${calculateProgress(
                    todayStats.calories,
                    todayStats.caloriesGoal
                  )}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Water Card */}
        <View style={[styles.statCard, styles.statCardBlue]}>
          <View style={styles.statHeader}>
            <LinearGradient
              colors={Colors.gradient.blue}
              style={styles.statIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="water" size={20} color={Colors.white} />
            </LinearGradient>
            <Text style={styles.statLabel}>Nước uống</Text>
          </View>
          <Text style={styles.statValue}>{todayStats.water} ml</Text>
          <Text style={styles.statGoal}>
            Mục tiêu: {todayStats.waterGoal} ml
          </Text>
          <View style={styles.miniProgressBg}>
            <View
              style={[
                styles.miniProgressFill,
                styles.miniProgressBlue,
                {
                  width: `${calculateProgress(
                    todayStats.water,
                    todayStats.waterGoal
                  )}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Sleep Card */}
        <View style={[styles.statCard, styles.statCardIndigo]}>
          <View style={styles.statHeader}>
            <LinearGradient
              colors={Colors.gradient.purple}
              style={styles.statIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="moon" size={20} color={Colors.white} />
            </LinearGradient>
            <Text style={styles.statLabel}>Giấc ngủ</Text>
          </View>
          <Text style={styles.statValue}>{todayStats.sleep}h</Text>
          <Text style={styles.statGoal}>
            Mục tiêu: {todayStats.sleepGoal}h
          </Text>
          <View style={styles.miniProgressBg}>
            <View
              style={[
                styles.miniProgressFill,
                styles.miniProgressIndigo,
                {
                  width: `${calculateProgress(
                    todayStats.sleep,
                    todayStats.sleepGoal
                  )}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Activity Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View style={styles.chartTitleContainer}>
            <Ionicons name="trending-up" size={20} color={Colors.purple[600]} />
            <Text style={styles.chartTitle}>Hoạt động trong tuần</Text>
          </View>
          <View style={styles.periodButtons}>
            <TouchableOpacity
              onPress={() => setSelectedPeriod('week')}
              style={[
                styles.periodButton,
                selectedPeriod === 'week' && styles.periodButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'week' && styles.periodButtonTextActive,
                ]}
              >
                Tuần
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedPeriod('month')}
              style={[
                styles.periodButton,
                selectedPeriod === 'month' && styles.periodButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'month' && styles.periodButtonTextActive,
                ]}
              >
                Tháng
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <LineChart
          data={weeklyData}
          width={screenWidth - 64}
          height={200}
          chartConfig={{
            backgroundColor: Colors.white,
            backgroundGradientFrom: Colors.white,
            backgroundGradientTo: Colors.white,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: Colors.purple[600],
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Recent Achievements */}
      <View style={styles.achievementsCard}>
        <View style={styles.achievementsHeader}>
          <Text style={styles.achievementsTitle}>Thành tích gần đây</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.purple[600]} />
          </TouchableOpacity>
        </View>

        <View style={styles.achievementsList}>
          <LinearGradient
            colors={['#fef3c7', '#fed7aa']}
            style={styles.achievementItem}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <LinearGradient
              colors={Colors.gradient.yellowOrange}
              style={styles.achievementIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="trophy" size={24} color={Colors.white} />
            </LinearGradient>
            <View>
              <Text style={styles.achievementTitle}>Đạt 10,000 bước</Text>
              <Text style={styles.achievementDesc}>3 ngày liên tiếp</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#dbeafe', '#cffafe']}
            style={styles.achievementItem}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <LinearGradient
              colors={Colors.gradient.blueCyan}
              style={styles.achievementIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="water" size={24} color={Colors.white} />
            </LinearGradient>
            <View>
              <Text style={styles.achievementTitle}>Hoàn thành mục tiêu nước</Text>
              <Text style={styles.achievementDesc}>Hôm nay</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  welcomeCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.purple[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.white,
  },
  goalCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
    backdropFilter: 'blur(10px)',
  },
  goalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: (screenWidth - 44) / 2,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardOrange: {
    borderColor: Colors.orange[100],
  },
  statCardRed: {
    borderColor: Colors.red[100],
  },
  statCardBlue: {
    borderColor: Colors.blue[100],
  },
  statCardIndigo: {
    borderColor: Colors.indigo[100],
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.slate[900],
    marginBottom: 4,
  },
  statGoal: {
    fontSize: 12,
    color: Colors.gray[500],
    marginBottom: 8,
  },
  miniProgressBg: {
    height: 6,
    backgroundColor: Colors.slate[100],
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  miniProgressOrange: {
    backgroundColor: Colors.orange[600],
  },
  miniProgressRed: {
    backgroundColor: Colors.red[600],
  },
  miniProgressBlue: {
    backgroundColor: Colors.blue[600],
  },
  miniProgressIndigo: {
    backgroundColor: Colors.indigo[600],
  },
  chartCard: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.gray[100],
  },
  periodButtonActive: {
    backgroundColor: Colors.purple[600],
  },
  periodButtonText: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  periodButtonTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  achievementsCard: {
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
    marginBottom: 32,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.purple[600],
    fontWeight: '500',
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[900],
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: Colors.gray[500],
  },
});
