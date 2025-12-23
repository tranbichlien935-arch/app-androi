import { Colors } from '@/constants/Colors';
import firebaseApi from '@/services/firebase-api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    steps: 0,
    stepsGoal: 10000,
    water: 0,
    waterGoal: 2000,
    sleep: 0,
    sleepGoal: 8,
    weight: 0,
  });
  const [userName, setUserName] = useState('Bạn');

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      const today = firebaseApi.getTodayDate();

      // Load user profile
      const profile = await firebaseApi.getUserProfile();
      if (profile) {
        setUserName(profile.full_name || 'Bạn');
      }

      // Load settings
      const settings = await firebaseApi.getUserSettings();

      // Load today's summary
      const summary = await firebaseApi.getDailySummary(today);

      // Load today's water
      const waterData = await firebaseApi.getWaterLogs(today);
      const totalWater = waterData.total || 0;

      // Load latest sleep
      const sleepData = await firebaseApi.getSleepLogs(today);
      const todaySleep = sleepData ? sleepData.total_hours : 0;

      // Load latest weight
      const weightLogs = await firebaseApi.getWeightLogs(1);
      const latestWeight = weightLogs.length > 0 ? weightLogs[0].weight : 0;

      setTodayStats({
        steps: summary.steps || 0,
        stepsGoal: settings.daily_steps_goal || 10000,
        water: totalWater,
        waterGoal: settings.daily_water_goal || 2000,
        sleep: todaySleep,
        sleepGoal: settings.daily_sleep_goal || 8,
        weight: latestWeight,
      });
    } catch (error) {
      console.error('Error loading today data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.purple[600]} />
        <Text style={{ marginTop: 16, color: Colors.gray[600] }}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Card */}
      <LinearGradient
        colors={Colors.gradient.purpleGreen}
        style={styles.welcomeCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.welcomeGreeting}>Xin chào, {userName}</Text>
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

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        {/* Steps */}
        <View style={[styles.statCard, { borderColor: Colors.orange[100] }]}>
          <LinearGradient
            colors={Colors.gradient.orange}
            style={styles.statIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="footsteps" size={20} color={Colors.white} />
          </LinearGradient>
          <Text style={styles.statLabel}>Bước chân</Text>
          <Text style={styles.statValue}>{todayStats.steps.toLocaleString()}</Text>
          <Text style={styles.statGoal}>/ {todayStats.stepsGoal.toLocaleString()}</Text>
        </View>

        {/* Water */}
        <View style={[styles.statCard, { borderColor: Colors.blue[100] }]}>
          <LinearGradient
            colors={Colors.gradient.blue}
            style={styles.statIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="water" size={20} color={Colors.white} />
          </LinearGradient>
          <Text style={styles.statLabel}>Nước uống</Text>
          <Text style={styles.statValue}>{todayStats.water} ml</Text>
          <Text style={styles.statGoal}>/ {todayStats.waterGoal} ml</Text>
        </View>

        {/* Sleep */}
        <View style={[styles.statCard, { borderColor: Colors.indigo[100] }]}>
          <LinearGradient
            colors={Colors.gradient.purple}
            style={styles.statIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="moon" size={20} color={Colors.white} />
          </LinearGradient>
          <Text style={styles.statLabel}>Giấc ngủ</Text>
          <Text style={styles.statValue}>{todayStats.sleep}h</Text>
          <Text style={styles.statGoal}>/ {todayStats.sleepGoal}h</Text>
        </View>

        {/* Weight */}
        <View style={[styles.statCard, { borderColor: Colors.green[100] }]}>
          <LinearGradient
            colors={Colors.gradient.green}
            style={styles.statIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="scale" size={20} color={Colors.white} />
          </LinearGradient>
          <Text style={styles.statLabel}>Cân nặng</Text>
          <Text style={styles.statValue}>{todayStats.weight} kg</Text>
          <Text style={styles.statGoal}>Hôm nay</Text>
        </View>
      </View>

      {/* Quick Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Mẹo hôm nay</Text>
        <Text style={styles.tipsText}>
          Uống một cốc nước ngay sau khi thức dậy giúp khởi động trao đổi chất!
        </Text>
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
    width: '47%',
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.slate[900],
  },
  statGoal: {
    fontSize: 12,
    color: Colors.gray[500],
    marginTop: 2,
  },
  tipsCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: Colors.yellow[50],
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.yellow[200],
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: Colors.gray[700],
    lineHeight: 20,
  },
});
