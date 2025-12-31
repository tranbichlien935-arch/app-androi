import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import firebaseApi from '@/services/firebase-api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const { logout, isAuthenticated, loading: authLoading } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: 'Đang tải...',
        email: '',
        age: 0,
        height: 0,
        gender: '',
        joinDate: '',
    });
    const [stats, setStats] = useState({
        consecutiveDays: 0,
        achievementsCount: 0,
        weightLost: 0
    });
    const [monthlyStats, setMonthlyStats] = useState({
        totalSteps: 0,
        avgSteps: 0,
        totalCalories: 0,
        avgCalories: 0,
        totalWater: 0,
        avgWater: 0,
        totalSleep: 0,
        avgSleep: 0
    });
    const [loading, setLoading] = useState(true);
    const [achievements, setAchievements] = useState([]);
    const [tempName, setTempName] = useState('');
    const [tempAge, setTempAge] = useState('');
    const [tempHeight, setTempHeight] = useState('');
    const [tempGender, setTempGender] = useState('');

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            loadUserProfile();
            loadStats();
            loadMonthlyStats();
            loadAchievements();
        } else if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [authLoading, isAuthenticated]);

    // Reload data when tab becomes focused
    useFocusEffect(
        useCallback(() => {
            if (!authLoading && isAuthenticated) {
                loadUserProfile();
                loadStats();
                loadMonthlyStats();
                loadAchievements();
            }
        }, [authLoading, isAuthenticated])
    );

    const loadUserProfile = async () => {
        try {
            const profile = await firebaseApi.getUserProfile();
            if (profile) {
                setUserInfo({
                    name: profile.full_name || 'Người dùng',
                    email: profile.email || '',
                    age: profile.age || 0,
                    height: profile.height || 0,
                    gender: profile.gender || 'Chưa cập nhật',
                    joinDate: profile.created_at ? new Date(profile.created_at.seconds * 1000).toLocaleDateString('vi-VN') : '',
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const consecutive = await firebaseApi.getConsecutiveDays();
            const weightProgress = await firebaseApi.getWeightProgress();

            setStats({
                consecutiveDays: consecutive,
                achievementsCount: 0, // Will implement later
                weightLost: Math.abs(weightProgress.lost)
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadMonthlyStats = async () => {
        try {
            const monthly = await firebaseApi.getMonthlyStats();
            setMonthlyStats(monthly);
        } catch (error) {
            console.error('Error loading monthly stats:', error);
        }
    };

    const loadAchievements = async () => {
        try {
            // Get all achievements
            const allAchievements = await firebaseApi.getAchievements();

            // Get user's unlocked achievements
            const userAchievements = await firebaseApi.getUserAchievements();
            const unlockedIds = new Set(userAchievements.map(a => a.achievement_id));

            // Merge data
            const merged = allAchievements.map(achievement => ({
                ...achievement,
                unlocked: unlockedIds.has(achievement.id),
                unlockedAt: userAchievements.find(u => u.achievement_id === achievement.id)?.unlocked_at
            }));

            setAchievements(merged);

            // Update achievements count in stats
            setStats(prev => ({
                ...prev,
                achievementsCount: userAchievements.length
            }));

            // Check for new achievements
            const newlyUnlocked = await firebaseApi.checkAndUnlockAchievements();
            if (newlyUnlocked.length > 0) {
                Alert.alert(
                    '🏆 Thành tích mới!',
                    `Bạn vừa mở khóa: ${newlyUnlocked.map(a => a.title).join(', ')}`,
                    [{ text: 'Tuyệt vời!' }]
                );
                // Reload achievements to show newly unlocked ones
                loadAchievements();
            }
        } catch (error) {
            console.error('Error loading achievements:', error);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc muốn đăng xuất?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('Starting logout...');
                            await logout();
                            console.log('Logout successful');
                            // Manual redirect as backup
                            router.replace('/sign-in');
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Lỗi', error.message || 'Không thể đăng xuất');
                        }
                    },
                },
            ]
        );
    };

    const saveUserProfile = async () => {
        const name = tempName.trim();
        const age = parseInt(tempAge);
        const height = parseInt(tempHeight);

        if (!name) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên');
            return;
        }
        if (!age || age <= 0 || age > 150) {
            Alert.alert('Lỗi', 'Vui lòng nhập tuổi hợp lệ (1-150)');
            return;
        }
        if (!height || height <= 0 || height > 300) {
            Alert.alert('Lỗi', 'Vui lòng nhập chiều cao hợp lệ (1-300cm)');
            return;
        }
        if (!tempGender) {
            Alert.alert('Lỗi', 'Vui lòng chọn giới tính');
            return;
        }

        try {
            // Update user profile (including height for BMI calculation)
            await firebaseApi.updateUserProfile({
                full_name: name,
                age: age,
                height: height,
                gender: tempGender
            });

            // Also update height in settings (for weight screen goals)
            await firebaseApi.updateUserSettings({
                height: height
            });

            setUserInfo(prev => ({
                ...prev,
                name: name,
                age: age,
                height: height,
                gender: tempGender
            }));

            setEditMode(false);
            Alert.alert('Thành công', 'Đã cập nhật thông tin');
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Lỗi', 'Không thể lưu thông tin');
        }
    };

    const handleMenuPress = (action) => {
        if (action === 'privacy') {
            Alert.alert(
                '🔒 Chính sách quyền riêng tư',
                'Healio cam kết bảo vệ quyền riêng tư của bạn:\n\n' +
                '• Dữ liệu sức khỏe được mã hóa và lưu trữ an toàn\n' +
                '• Không chia sẻ thông tin cá nhân với bên thứ ba\n' +
                '• Bạn có toàn quyền kiểm soát dữ liệu của mình\n' +
                '• Dữ liệu chỉ được sử dụng để cải thiện trải nghiệm\n\n' +
                'Để biết thêm chi tiết, vui lòng truy cập trang web của chúng tôi.',
                [{ text: 'Đã hiểu', style: 'default' }]
            );
        } else if (action === 'help') {
            Alert.alert(
                '❓ Trợ giúp & Hỗ trợ',
                'Cần hỗ trợ? Chúng tôi luôn sẵn sàng giúp đỡ!\n\n' +
                '📧 Email: support@healio.com\n' +
                '📱 Hotline: 1900-3105\n' +
                '🌐 Website: www.healio.com\n\n' +
                'Thời gian hỗ trợ: 8:00 - 22:00 hàng ngày',
                [{ text: 'Đóng', style: 'cancel' }]
            );
        }
    };

    const menuItems = [
        {
            icon: 'shield-checkmark-outline',
            label: 'Chính sách quyền riêng tư',
            color: Colors.purple[600],
            bg: Colors.purple[100],
            action: 'privacy'
        },
        {
            icon: 'help-circle-outline',
            label: 'Trợ giúp & Hỗ trợ',
            color: Colors.green[600],
            bg: Colors.green[100],
            action: 'help'
        },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <LinearGradient
                colors={['#ec4899', '#9333ea']}
                style={styles.profileHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.profileTop}>
                    <View style={styles.profileInfo}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person" size={48} color={Colors.white} />
                        </View>
                        <View>
                            <Text style={styles.profileName}>{userInfo.name}</Text>
                            <Text style={styles.profileEmail}>{userInfo.email}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            if (editMode) {
                                setEditMode(false);
                            } else {
                                setTempName(userInfo.name);
                                setTempAge(userInfo.age.toString());
                                setTempHeight(userInfo.height.toString());
                                setTempGender(userInfo.gender);
                                setEditMode(true);
                            }
                        }}
                        style={styles.editButton}
                    >
                        <Ionicons name={editMode ? "close" : "create-outline"} size={20} color={Colors.white} />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Thông tin cá nhân</Text>
                    {editMode ? (
                        <View style={styles.editForm}>
                            <View style={styles.editField}>
                                <Text style={styles.editLabel}>Họ tên</Text>
                                <TextInput
                                    style={styles.editInput}
                                    value={tempName}
                                    onChangeText={setTempName}
                                    placeholder="Nhập họ tên"
                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                />
                            </View>
                            <View style={styles.editRow}>
                                <View style={[styles.editField, { flex: 1 }]}>
                                    <Text style={styles.editLabel}>Tuổi</Text>
                                    <TextInput
                                        style={styles.editInput}
                                        value={tempAge}
                                        onChangeText={setTempAge}
                                        placeholder="Tuổi"
                                        keyboardType="number-pad"
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                    />
                                </View>
                                <View style={[styles.editField, { flex: 1 }]}>
                                    <Text style={styles.editLabel}>Chiều cao (cm)</Text>
                                    <TextInput
                                        style={styles.editInput}
                                        value={tempHeight}
                                        onChangeText={setTempHeight}
                                        placeholder="Chiều cao"
                                        keyboardType="number-pad"
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                    />
                                </View>
                            </View>
                            <View style={styles.editField}>
                                <Text style={styles.editLabel}>Giới tính</Text>
                                <View style={styles.genderButtons}>
                                    <TouchableOpacity
                                        style={[
                                            styles.genderButton,
                                            tempGender === 'Nam' && styles.genderButtonActive
                                        ]}
                                        onPress={() => setTempGender('Nam')}
                                    >
                                        <Text style={[
                                            styles.genderButtonText,
                                            tempGender === 'Nam' && styles.genderButtonTextActive
                                        ]}>Nam</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.genderButton,
                                            tempGender === 'Nữ' && styles.genderButtonActive
                                        ]}
                                        onPress={() => setTempGender('Nữ')}
                                    >
                                        <Text style={[
                                            styles.genderButtonText,
                                            tempGender === 'Nữ' && styles.genderButtonTextActive
                                        ]}>Nữ</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity onPress={saveUserProfile} style={styles.saveButton}>
                                <LinearGradient
                                    colors={['#ec4899', '#9333ea']}
                                    style={styles.saveButtonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.saveButtonText}>Lưu thông tin</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoValue}>{userInfo.age}</Text>
                                <Text style={styles.infoUnit}>Tuổi</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoValue}>{userInfo.height}</Text>
                                <Text style={styles.infoUnit}>cm</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoValue}>{userInfo.gender}</Text>
                                <Text style={styles.infoUnit}>Giới tính</Text>
                            </View>
                        </View>
                    )}
                </View>
            </LinearGradient>

            {/* Stats Summary */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.consecutiveDays}</Text>
                    <Text style={styles.statLabel}>Ngày liên tiếp</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.achievementsCount}</Text>
                    <Text style={styles.statLabel}>Thành tích</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.weightLost.toFixed(1)}</Text>
                    <Text style={styles.statLabel}>kg giảm</Text>
                </View>
            </View>

            {/* Achievements */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thành tích đạt được</Text>
                <View style={styles.achievementsGrid}>
                    {achievements.map((achievement, index) => (
                        <View
                            key={achievement.id || index}
                            style={[
                                styles.achievementCard,
                                !achievement.unlocked && styles.achievementCardLocked
                            ]}
                        >
                            <View style={styles.achievementHeader}>
                                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                                {achievement.unlocked && (
                                    <View style={styles.unlockedBadge}>
                                        <Ionicons name="checkmark-circle" size={20} color={Colors.green[600]} />
                                    </View>
                                )}
                                {!achievement.unlocked && (
                                    <View style={styles.lockedBadge}>
                                        <Ionicons name="lock-closed" size={16} color={Colors.gray[400]} />
                                    </View>
                                )}
                            </View>
                            <Text style={[
                                styles.achievementTitle,
                                !achievement.unlocked && styles.achievementTitleLocked
                            ]}>
                                {achievement.title}
                            </Text>
                            <Text style={[
                                styles.achievementDesc,
                                !achievement.unlocked && styles.achievementDescLocked
                            ]}>
                                {achievement.description}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Activity Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tổng quan tháng này</Text>
                <View style={styles.activityList}>
                    <View style={styles.activityItem}>
                        <View style={styles.activityLeft}>
                            <LinearGradient
                                colors={Colors.gradient.orange}
                                style={styles.activityIcon}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.activityEmoji}>🏃</Text>
                            </LinearGradient>
                            <View>
                                <Text style={styles.activityTitle}>Tổng bước chân</Text>
                                <Text style={styles.activitySubtitle}>Trung bình/ngày</Text>
                            </View>
                        </View>
                        <View style={styles.activityRight}>
                            <Text style={styles.activityValue}>{monthlyStats.totalSteps.toLocaleString()}</Text>
                            <Text style={styles.activityAvg}>{monthlyStats.avgSteps.toLocaleString()} bước</Text>
                        </View>
                    </View>

                    <View style={styles.activityItem}>
                        <View style={styles.activityLeft}>
                            <LinearGradient
                                colors={Colors.gradient.red}
                                style={styles.activityIcon}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.activityEmoji}>🔥</Text>
                            </LinearGradient>
                            <View>
                                <Text style={styles.activityTitle}>Tổng calo đốt</Text>
                                <Text style={styles.activitySubtitle}>Trung bình/ngày</Text>
                            </View>
                        </View>
                        <View style={styles.activityRight}>
                            <Text style={styles.activityValue}>{monthlyStats.totalCalories.toLocaleString()} kcal</Text>
                            <Text style={styles.activityAvg}>{monthlyStats.avgCalories.toLocaleString()} kcal</Text>
                        </View>
                    </View>

                    <View style={styles.activityItem}>
                        <View style={styles.activityLeft}>
                            <LinearGradient
                                colors={Colors.gradient.blue}
                                style={styles.activityIcon}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.activityEmoji}>💧</Text>
                            </LinearGradient>
                            <View>
                                <Text style={styles.activityTitle}>Tổng nước uống</Text>
                                <Text style={styles.activitySubtitle}>Trung bình/ngày</Text>
                            </View>
                        </View>
                        <View style={styles.activityRight}>
                            <Text style={styles.activityValue}>{(monthlyStats.totalWater / 1000).toFixed(1)} lít</Text>
                            <Text style={styles.activityAvg}>{monthlyStats.avgWater.toLocaleString()} ml</Text>
                        </View>
                    </View>

                    <View style={styles.activityItem}>
                        <View style={styles.activityLeft}>
                            <LinearGradient
                                colors={Colors.gradient.purple}
                                style={styles.activityIcon}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.activityEmoji}>🌙</Text>
                            </LinearGradient>
                            <View>
                                <Text style={styles.activityTitle}>Tổng giờ ngủ</Text>
                                <Text style={styles.activitySubtitle}>Trung bình/đêm</Text>
                            </View>
                        </View>
                        <View style={styles.activityRight}>
                            <Text style={styles.activityValue}>{monthlyStats.totalSleep} giờ</Text>
                            <Text style={styles.activityAvg}>{monthlyStats.avgSleep} giờ</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Settings Menu */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông tin & Hỗ trợ</Text>
                <View style={styles.menuList}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => handleMenuPress(item.action)}
                        >
                            <View style={styles.menuLeft}>
                                <View style={[styles.menuIconContainer, { backgroundColor: item.bg }]}>
                                    <Ionicons name={item.icon} size={20} color={item.color} />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* App Info */}
            <View style={styles.section}>
                <View style={styles.appInfoRow}>
                    <Text style={styles.appInfoLabel}>Phiên bản ứng dụng</Text>
                    <Text style={styles.appInfoValue}>1.0.0</Text>
                </View>
                <View style={styles.appInfoRow}>
                    <Text style={styles.appInfoLabel}>Ngày tham gia</Text>
                    <Text style={styles.appInfoValue}>{userInfo.joinDate}</Text>
                </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity activeOpacity={0.8} style={styles.logoutContainer} onPress={handleLogout}>
                <LinearGradient
                    colors={['#ef4444', '#dc2626']}
                    style={styles.logoutButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Ionicons name="log-out-outline" size={20} color={Colors.white} />
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    profileHeader: {
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
    profileTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileName: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.white,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoCard: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 16,
    },
    infoLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 12,
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    infoItem: {
        alignItems: 'center',
    },
    infoValue: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.white,
    },
    infoUnit: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
    },
    editForm: {
        gap: 16,
    },
    editRow: {
        flexDirection: 'row',
        gap: 12,
    },
    editField: {
        gap: 8,
    },
    editLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    editInput: {
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: Colors.white,
        fontWeight: '500',
    },
    genderButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    genderButton: {
        flex: 1,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    genderButtonActive: {
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderColor: Colors.white,
    },
    genderButtonText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    genderButtonTextActive: {
        color: Colors.white,
        fontWeight: '600',
    },
    saveButton: {
        height: 44,
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 8,
    },
    saveButtonGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },
    statBox: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '600',
        color: Colors.orange[600],
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.gray[600],
        textAlign: 'center',
    },
    section: {
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
        marginBottom: 16,
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    achievementCard: {
        width: '48%',
        backgroundColor: '#fef3c7',
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: '#fde68a',
    },
    achievementCardLocked: {
        backgroundColor: Colors.gray[100],
        borderColor: Colors.gray[200],
        opacity: 0.7,
    },
    achievementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    achievementIcon: {
        fontSize: 36,
    },
    unlockedBadge: {
        marginTop: 4,
    },
    lockedBadge: {
        marginTop: 8,
    },
    achievementTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray[900],
        marginBottom: 4,
    },
    achievementTitleLocked: {
        color: Colors.gray[500],
    },
    achievementDesc: {
        fontSize: 12,
        color: Colors.gray[600],
    },
    achievementDescLocked: {
        color: Colors.gray[400],
    },
    activityList: {
        gap: 16,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityEmoji: {
        fontSize: 20,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray[900],
    },
    activitySubtitle: {
        fontSize: 12,
        color: Colors.gray[500],
    },
    activityRight: {
        alignItems: 'flex-end',
    },
    activityValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    activityAvg: {
        fontSize: 12,
        color: Colors.gray[500],
    },
    menuList: {
        gap: 8,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        backgroundColor: Colors.slate[50],
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: {
        fontSize: 16,
        color: Colors.gray[900],
    },
    appInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    appInfoLabel: {
        fontSize: 14,
        color: Colors.gray[600],
    },
    appInfoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray[900],
    },
    logoutContainer: {
        margin: 16,
        marginTop: 0,
        marginBottom: 32,
    },
    logoutButton: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: Colors.red[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
});
