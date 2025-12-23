import { Colors } from '@/constants/Colors';
import firebaseApi from '@/services/firebase-api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: 'Đang tải...',
        email: '',
        age: 0,
        height: 0,
        gender: '',
        joinDate: '',
    });

    useEffect(() => {
        loadUserProfile();
    }, []);

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
                            await firebaseApi.logout();
                            // AuthContext will auto-redirect to /sign-in
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể đăng xuất');
                        }
                    },
                },
            ]
        );
    };

    const achievements = [
        { icon: '🏆', title: 'Người kiên trì', desc: 'Đạt mục tiêu 30 ngày liên tiếp' },
        { icon: '⭐', title: 'Ngôi sao giảm cân', desc: 'Giảm được 5kg' },
        { icon: '💧', title: 'Chuyên gia hydrat', desc: 'Uống đủ nước 7 ngày' },
        { icon: '🌙', title: 'Bậc thầy giấc ngủ', desc: 'Ngủ đủ giác 14 ngày' },
    ];

    const menuItems = [
        { icon: 'settings-outline', label: 'Cài đặt', color: Colors.gray[600], bg: Colors.gray[100] },
        { icon: 'notifications-outline', label: 'Thông báo', color: Colors.blue[600], bg: Colors.blue[100] },
        { icon: 'shield-checkmark-outline', label: 'Quyền riêng tư', color: Colors.purple[600], bg: Colors.purple[100] },
        { icon: 'help-circle-outline', label: 'Trợ giúp', color: Colors.green[600], bg: Colors.green[100] },
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
                        onPress={() => setEditMode(!editMode)}
                        style={styles.editButton}
                    >
                        <Ionicons name="create-outline" size={20} color={Colors.white} />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Thông tin cá nhân</Text>
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
                </View>
            </LinearGradient>

            {/* Stats Summary */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>52</Text>
                    <Text style={styles.statLabel}>Ngày liên tiếp</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>8</Text>
                    <Text style={styles.statLabel}>Thành tích</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>2.5</Text>
                    <Text style={styles.statLabel}>kg giảm</Text>
                </View>
            </View>

            {/* Achievements */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thành tích đạt được</Text>
                <View style={styles.achievementsGrid}>
                    {achievements.map((achievement, index) => (
                        <View key={index} style={styles.achievementCard}>
                            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                            <Text style={styles.achievementTitle}>{achievement.title}</Text>
                            <Text style={styles.achievementDesc}>{achievement.desc}</Text>
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
                            <Text style={styles.activityValue}>245,680</Text>
                            <Text style={styles.activityAvg}>8,189 bước</Text>
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
                            <Text style={styles.activityValue}>9,840 kcal</Text>
                            <Text style={styles.activityAvg}>328 kcal</Text>
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
                            <Text style={styles.activityValue}>58 lít</Text>
                            <Text style={styles.activityAvg}>1,933 ml</Text>
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
                            <Text style={styles.activityValue}>225 giờ</Text>
                            <Text style={styles.activityAvg}>7.5 giờ</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Settings Menu */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cài đặt</Text>
                <View style={styles.menuList}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
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
        </ScrollView>
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
    achievementIcon: {
        fontSize: 36,
        marginBottom: 8,
    },
    achievementTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray[900],
        marginBottom: 4,
    },
    achievementDesc: {
        fontSize: 12,
        color: Colors.gray[600],
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
