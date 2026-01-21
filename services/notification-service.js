import * as Notifications from 'expo-notifications';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,  // Hiển thị notification ngay cả khi app đang mở
        shouldPlaySound: true,  // Phát âm thanh
        shouldSetBadge: false,  // Không cập nhật badge
    }),
});

class NotificationService {
    constructor() {
        this.permissionGranted = false;
    }

    /**
     * Yêu cầu quyền thông báo từ user
     * Chỉ cần gọi 1 lần khi app khởi động
     */
    async requestPermission() {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // Nếu chưa có quyền, yêu cầu quyền
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            this.permissionGranted = finalStatus === 'granted';

            if (!this.permissionGranted) {
                console.log('Notification permission denied');
            }

            return this.permissionGranted;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    /**
     * Hiển thị thông báo khi hoàn thành hoạt động
     * @param {Object} params - Thông tin hoạt động
     * @param {string} params.activityName - Tên hoạt động
     * @param {number} params.duration - Thời gian (phút)
     * @param {number} params.calories - Calories đã đốt
     * @param {number} params.distance - Khoảng cách (km) - optional
     */
    async showActivityCompletionNotification({ activityName, duration, calories, distance }) {
        try {
            // Kiểm tra quyền, nếu chưa có thì request
            if (!this.permissionGranted) {
                const granted = await this.requestPermission();
                if (!granted) {
                    return { success: false, reason: 'permission_denied' };
                }
            }

            // Tạo nội dung thông báo động dựa vào loại hoạt động
            let body = `Bạn vừa hoàn thành ${duration} phút ${activityName.toLowerCase()}! 🔥\n`;
            body += `💪 Đốt cháy: ${calories} kcal`;

            if (distance && distance > 0) {
                body += `\n🏃 Quãng đường: ${distance.toFixed(1)} km`;
            }

            // Schedule notification ngay lập tức
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Hoàn thành xuất sắc! 🎉',
                    body: body,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: {
                        type: 'activity_completion',
                        activityName,
                        duration,
                        calories,
                        distance
                    },
                },
                trigger: null, // null = hiển thị ngay lập tức
            });

            return { success: true };
        } catch (error) {
            console.error('Error showing notification:', error);
            return { success: false, reason: 'error', error };
        }
    }

    /**
     * Hiển thị thông báo milestone (optional - có thể dùng sau)
     * VD: Đạt 10,000 bước, hoàn thành 5 hoạt động trong tuần
     */
    async showMilestoneNotification({ title, message }) {
        try {
            if (!this.permissionGranted) {
                const granted = await this.requestPermission();
                if (!granted) return { success: false };
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: title || 'Chúc mừng! 🏆',
                    body: message,
                    sound: true,
                },
                trigger: null,
            });

            return { success: true };
        } catch (error) {
            console.error('Error showing milestone notification:', error);
            return { success: false, error };
        }
    }

    /**
     * Hiển thị thông báo khi hoàn thành mục tiêu uống nước
     * @param {Object} params - Thông tin nước uống
     * @param {number} params.amount - Lượng nước hiện tại (ml)
     * @param {number} params.goal - Mục tiêu (ml)
     * @param {number} params.percentage - Phần trăm hoàn thành
     */
    async showWaterGoalAchievedNotification({ amount, goal, percentage }) {
        try {
            if (!this.permissionGranted) {
                const granted = await this.requestPermission();
                if (!granted) return { success: false, reason: 'permission_denied' };
            }

            let body = `Bạn đã hoàn thành mục tiêu ${goal}ml hôm nay! 🎉\n`;
            body += `💧 Tổng: ${amount}ml (${Math.round(percentage)}%)`;

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Tuyệt vời! 💧',
                    body: body,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: {
                        type: 'water_goal_achieved',
                        amount,
                        goal,
                        percentage
                    },
                },
                trigger: null,
            });

            return { success: true };
        } catch (error) {
            console.error('Error showing water notification:', error);
            return { success: false, reason: 'error', error };
        }
    }

    /**
     * Hiển thị thông báo khi lưu cân nặng
     * @param {Object} params - Thông tin cân nặng
     * @param {number} params.weight - Cân nặng mới (kg)
     * @param {number} params.change - Thay đổi so với lần trước (kg)
     */
    async showWeightSavedNotification({ weight, change }) {
        try {
            if (!this.permissionGranted) {
                const granted = await this.requestPermission();
                if (!granted) return { success: false, reason: 'permission_denied' };
            }

            let body = `Cân nặng: ${weight}kg`;

            if (change !== 0 && !isNaN(change)) {
                const changeText = change > 0 ? `+${change.toFixed(1)}kg` : `${change.toFixed(1)}kg`;
                const emoji = change > 0 ? '📈' : '📉';
                body += `\n${emoji} ${changeText} từ lần trước`;
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Đã ghi nhận! ⚖️',
                    body: body,
                    sound: true,
                    data: {
                        type: 'weight_saved',
                        weight,
                        change
                    },
                },
                trigger: null,
            });

            return { success: true };
        } catch (error) {
            console.error('Error showing weight notification:', error);
            return { success: false, reason: 'error', error };
        }
    }

    /**
     * Hiển thị thông báo khi đạt milestone giảm cân
     * @param {Object} params - Thông tin milestone
     * @param {number} params.milestone - Milestone đạt được (kg)
     * @param {number} params.totalLoss - Tổng đã giảm (kg)
     */
    async showWeightMilestoneNotification({ milestone, totalLoss }) {
        try {
            if (!this.permissionGranted) {
                const granted = await this.requestPermission();
                if (!granted) return { success: false, reason: 'permission_denied' };
            }

            let body = `Bạn đã đạt mốc ${milestone}kg! 🎉\n`;
            body += `🏆 Tổng đã giảm: ${Math.abs(totalLoss).toFixed(1)}kg`;

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Cột mốc mới! 🏆',
                    body: body,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: {
                        type: 'weight_milestone',
                        milestone,
                        totalLoss
                    },
                },
                trigger: null,
            });

            return { success: true };
        } catch (error) {
            console.error('Error showing milestone notification:', error);
            return { success: false, reason: 'error', error };
        }
    }

    /**
     * Hiển thị thông báo về giấc ngủ
     * @param {Object} params - Thông tin giấc ngủ
     * @param {number} params.hours - Số giờ ngủ
     * @param {number} params.quality - Chất lượng (%)
     */
    async showSleepGoalAchievedNotification({ hours, quality }) {
        try {
            if (!this.permissionGranted) {
                const granted = await this.requestPermission();
                if (!granted) return { success: false, reason: 'permission_denied' };
            }

            let title = 'Ngủ ngon! 🌙';
            let body = `Bạn đã ngủ được ${hours.toFixed(1)} giờ`;

            if (quality > 0) {
                body += ` • Chất lượng: ${quality}%`;
            }

            // Đánh giá giấc ngủ
            if (hours >= 7 && hours <= 9) {
                body += '\n✅ Giấc ngủ đủ và chất lượng!';
            } else if (hours < 7) {
                title = 'Ngủ ít quá! 😴';
                body += '\n⚠️ Nên ngủ thêm để khỏe mạnh nhé';
            } else {
                title = 'Ngủ nhiều đấy! 😴';
                body += '\n💤 Ngủ quá nhiều cũng không tốt lắm';
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: body,
                    sound: true,
                    data: {
                        type: 'sleep_logged',
                        hours,
                        quality
                    },
                },
                trigger: null,
            });

            return { success: true };
        } catch (error) {
            console.error('Error showing sleep notification:', error);
            return { success: false, reason: 'error', error };
        }
    }

    /**
     * Schedule thông báo nhắc nhở (optional - có thể dùng sau)
     * VD: Nhắc uống nước, nhắc vận động
     */
    async scheduleReminder({ title, body, triggerSeconds }) {
        try {
            if (!this.permissionGranted) {
                const granted = await this.requestPermission();
                if (!granted) return { success: false };
            }

            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                    title: title || 'Nhắc nhở 🔔',
                    body: body,
                    sound: true,
                },
                trigger: {
                    seconds: triggerSeconds || 3600, // Mặc định 1 giờ
                },
            });

            return { success: true, identifier };
        } catch (error) {
            console.error('Error scheduling reminder:', error);
            return { success: false, error };
        }
    }

    /**
     * Cancel một reminder đã schedule
     */
    async cancelReminder(identifier) {
        try {
            await Notifications.cancelScheduledNotificationAsync(identifier);
            return { success: true };
        } catch (error) {
            console.error('Error canceling reminder:', error);
            return { success: false, error };
        }
    }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
