import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    limit as firestoreLimit,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import {
    getStorage,
    ref
} from 'firebase/storage';
import { auth, db } from '../config/firebase';

class FirebaseApiService {
    // ============ HELPER METHODS ============

    getCurrentUserId() {
        return auth.currentUser?.uid;
    }

    getCurrentUser() {
        return auth.currentUser;
    }

    onAuthChange(callback) {
        return onAuthStateChanged(auth, callback);
    }

    getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    getDateDaysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    // ============ AUTHENTICATION ============

    async register(email, password, userData = {}) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                full_name: userData.fullName || '',
                age: userData.age || null,
                height: userData.height || null,
                gender: userData.gender || null,
                created_at: serverTimestamp(),
            });

            // Create default settings
            await setDoc(doc(db, 'users', user.uid, 'settings', 'default'), {
                daily_steps_goal: 10000,
                daily_calories_goal: 500,
                daily_water_goal: 2000,
                glass_size: 200,
                daily_sleep_goal: 8.0,
                target_weight: null,
                start_weight: null,
            });

            return { user, success: true };
        } catch (error) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { user: userCredential.user, success: true };
        } catch (error) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            throw new Error('Đăng xuất thất bại');
        }
    }

    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    // ============ ACTIVITIES ============

    async getActivities(date = null, limitCount = 50) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const activitiesRef = collection(db, 'users', userId, 'activities');
            let q = query(activitiesRef, orderBy('date', 'desc'), firestoreLimit(limitCount));

            if (date) {
                q = query(activitiesRef, where('date', '==', date), orderBy('time', 'desc'));
            }

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            throw new Error('Lỗi khi lấy danh sách hoạt động');
        }
    }

    async createActivity(data) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const activitiesRef = collection(db, 'users', userId, 'activities');
            const docRef = await addDoc(activitiesRef, {
                ...data,
                created_at: serverTimestamp(),
            });

            return { id: docRef.id, ...data };
        } catch (error) {
            throw new Error('Lỗi khi thêm hoạt động');
        }
    }

    async updateActivity(id, data) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const activityRef = doc(db, 'users', userId, 'activities', id);
            await updateDoc(activityRef, data);
            return { id, ...data };
        } catch (error) {
            throw new Error('Lỗi khi cập nhật hoạt động');
        }
    }

    async deleteActivity(id) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const activityRef = doc(db, 'users', userId, 'activities', id);
            await deleteDoc(activityRef);
            return { success: true };
        } catch (error) {
            throw new Error('Lỗi khi xóa hoạt động');
        }
    }

    // ============ DAILY SUMMARY ============

    async getDailySummary(date = null, days = 7) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            if (date) {
                // Get specific date
                const summaryRef = doc(db, 'users', userId, 'daily_summaries', date);
                const snapshot = await getDoc(summaryRef);

                if (snapshot.exists()) {
                    return { id: snapshot.id, ...snapshot.data() };
                }
                return { date, steps: 0, distance: 0, calories: 0, active_minutes: 0 };
            } else {
                // Get last N days
                const summariesRef = collection(db, 'users', userId, 'daily_summaries');
                const q = query(summariesRef, orderBy('date', 'desc'), firestoreLimit(days));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
        } catch (error) {
            throw new Error('Lỗi khi lấy tổng hợp hoạt động');
        }
    }

    async updateDailySummary(data) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const summaryRef = doc(db, 'users', userId, 'daily_summaries', data.date);
            await setDoc(summaryRef, {
                ...data,
                updated_at: serverTimestamp(),
            }, { merge: true });

            return data;
        } catch (error) {
            throw new Error('Lỗi khi cập nhật tổng hợp');
        }
    }

    // ============ WATER LOGS ============

    async getWaterLogs(date = null, days = 7) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const waterRef = collection(db, 'users', userId, 'water_logs');

            if (date) {
                // Query by date only, sort on client-side to avoid composite index requirement
                const q = query(waterRef, where('date', '==', date));
                const snapshot = await getDocs(q);
                const logs = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => (a.time || '').localeCompare(b.time || '')); // Client-side sort
                const total = logs.reduce((sum, log) => sum + log.amount, 0);
                return { logs, total };
            } else {
                const q = query(waterRef, orderBy('date', 'desc'), firestoreLimit(days * 10));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
        } catch (error) {
            console.error('Error in getWaterLogs:', error);
            throw new Error('Lỗi khi lấy nhật ký nước');
        }
    }

    async addWaterLog(data) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const waterRef = collection(db, 'users', userId, 'water_logs');
            const docRef = await addDoc(waterRef, {
                ...data,
                created_at: serverTimestamp(),
            });

            return { id: docRef.id, ...data };
        } catch (error) {
            throw new Error('Lỗi khi thêm nước');
        }
    }

    async updateWaterLog(id, data) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const waterRef = doc(db, 'users', userId, 'water_logs', id);
            await updateDoc(waterRef, data);
            return { id, ...data };
        } catch (error) {
            throw new Error('Lỗi khi cập nhật');
        }
    }

    async deleteWaterLog(id) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const waterRef = doc(db, 'users', userId, 'water_logs', id);
            await deleteDoc(waterRef);
            return { success: true };
        } catch (error) {
            throw new Error('Lỗi khi xóa');
        }
    }

    // ============ SLEEP LOGS ============

    async getSleepLogs(date = null, days = 7) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const sleepRef = collection(db, 'users', userId, 'sleep_logs');

            if (date) {
                const q = query(sleepRef, where('date', '==', date));
                const snapshot = await getDocs(q);
                return snapshot.docs.length > 0 ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null;
            } else {
                const q = query(sleepRef, orderBy('date', 'desc'), firestoreLimit(days));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
        } catch (error) {
            throw new Error('Lỗi khi lấy nhật ký giấc ngủ');
        }
    }

    async addSleepLog(data) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const sleepRef = collection(db, 'users', userId, 'sleep_logs');
            const docRef = await addDoc(sleepRef, {
                ...data,
                created_at: serverTimestamp(),
            });

            return { id: docRef.id, ...data };
        } catch (error) {
            throw new Error('Lỗi khi thêm giấc ngủ');
        }
    }

    async updateSleepLog(id, data) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const sleepRef = doc(db, 'users', userId, 'sleep_logs', id);
            await updateDoc(sleepRef, data);
            return { id, ...data };
        } catch (error) {
            throw new Error('Lỗi khi cập nhật');
        }
    }

    async deleteSleepLog(id) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const sleepRef = doc(db, 'users', userId, 'sleep_logs', id);
            await deleteDoc(sleepRef);
            return { success: true };
        } catch (error) {
            throw new Error('Lỗi khi xóa');
        }
    }

    // ============ WEIGHT LOGS ============

    async getWeightLogs(limitCount = 30) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const weightRef = collection(db, 'users', userId, 'weight_logs');
            // Sort by created_at to get the most recent entry first
            const q = query(weightRef, orderBy('created_at', 'desc'), firestoreLimit(limitCount));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            throw new Error('Lỗi khi lấy lịch sử cân nặng');
        }
    }

    async addWeightLog(data) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            // Get user height to calculate BMI
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            let bmi = null;
            if (userSnap.exists() && userSnap.data().height) {
                const heightInMeters = userSnap.data().height / 100;
                bmi = parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(1));
            }

            const weightRef = collection(db, 'users', userId, 'weight_logs');
            const docRef = await addDoc(weightRef, {
                ...data,
                bmi,
                created_at: serverTimestamp(),
            });

            return { id: docRef.id, ...data, bmi };
        } catch (error) {
            throw new Error('Lỗi khi thêm cân nặng');
        }
    }

    async updateWeightLog(id, data) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            // Recalculate BMI
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            let bmi = null;
            if (userSnap.exists() && userSnap.data().height) {
                const heightInMeters = userSnap.data().height / 100;
                bmi = parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(1));
            }

            const weightRef = doc(db, 'users', userId, 'weight_logs', id);
            await updateDoc(weightRef, { ...data, bmi });
            return { id, ...data, bmi };
        } catch (error) {
            throw new Error('Lỗi khi cập nhật');
        }
    }

    async deleteWeightLog(id) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const weightRef = doc(db, 'users', userId, 'weight_logs', id);
            await deleteDoc(weightRef);
            return { success: true };
        } catch (error) {
            throw new Error('Lỗi khi xóa');
        }
    }

    // ============ USER SETTINGS ============

    async getUserSettings() {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const settingsRef = doc(db, 'users', userId, 'settings', 'default');
            const snapshot = await getDoc(settingsRef);

            if (snapshot.exists()) {
                return snapshot.data();
            }

            // Return default settings if not exists
            return {
                daily_steps_goal: 10000,
                daily_calories_goal: 500,
                daily_water_goal: 2000,
                glass_size: 200,
                daily_sleep_goal: 8.0,
                target_weight: null,
                start_weight: null,
            };
        } catch (error) {
            throw new Error('Lỗi khi lấy cài đặt');
        }
    }

    async updateUserSettings(data) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const settingsRef = doc(db, 'users', userId, 'settings', 'default');
            await setDoc(settingsRef, data, { merge: true });
            return data;
        } catch (error) {
            throw new Error('Lỗi khi cập nhật cài đặt');
        }
    }

    // ============ USER PROFILE ============

    async getUserProfile() {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const userRef = doc(db, 'users', userId);
            const snapshot = await getDoc(userRef);

            if (snapshot.exists()) {
                return { id: snapshot.id, ...snapshot.data() };
            }
            return null;
        } catch (error) {
            throw new Error('Lỗi khi lấy thông tin người dùng');
        }
    }

    async updateUserProfile(data) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, data);
            return { success: true };
        } catch (error) {
            throw new Error('Không thể cập nhật thông tin');
        }
    }

    async uploadProfilePicture(uri, options = {}) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            // Step 1: Get old photo URL (for reference)
            const profile = await this.getUserProfile();
            const oldPhotoUrl = profile?.photo_url;

            // Step 2: Upload to Cloudinary
            console.log('Uploading to Cloudinary...');
            const cloudinaryService = await import('../services/cloudinary-service.js').then(m => m.default);
            const uploadResult = await cloudinaryService.uploadProfilePicture(uri);

            if (!uploadResult.success || !uploadResult.url) {
                throw new Error('Upload không thành công');
            }

            console.log('Cloudinary upload successful! URL:', uploadResult.url);

            // Step 3: Update user profile with Cloudinary URL
            await this.updateUserProfile({ photo_url: uploadResult.url });

            return {
                success: true,
                url: uploadResult.url,
                publicId: uploadResult.publicId,
                size: uploadResult.bytes,
            };
        } catch (error) {
            console.error('Upload error:', error);

            // Provide specific error messages
            if (error.message.includes('chưa được cấu hình')) {
                throw new Error(error.message);
            } else if (error.message.includes('Không thể kết nối')) {
                throw new Error(error.message);
            } else {
                throw new Error('Không thể tải ảnh lên: ' + error.message);
            }
        }
    }

    async deleteImageFromStorage(imageUrl) {
        if (!imageUrl) return;

        try {
            const storage = getStorage();
            // Extract path from URL
            // URL format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?...
            const urlParts = imageUrl.split('/o/');
            if (urlParts.length < 2) {
                throw new Error('Invalid image URL');
            }

            const pathWithParams = urlParts[1];
            const path = decodeURIComponent(pathWithParams.split('?')[0]);

            const imageRef = ref(storage, path);
            const { deleteObject } = await import('firebase/storage');
            await deleteObject(imageRef);

            return { success: true };
        } catch (error) {
            console.error('Delete error:', error);
            throw new Error('Không thể xóa ảnh cũ');
        }
    }

    // ============ ERROR MESSAGES ============

    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/email-already-in-use': 'Email đã được sử dụng',
            'auth/invalid-email': 'Email không hợp lệ',
            'auth/operation-not-allowed': 'Thao tác không được phép',
            'auth/weak-password': 'Mật khẩu quá yếu (tối thiểu 6 ký tự)',
            'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa',
            'auth/user-not-found': 'Không tìm thấy tài khoản',
            'auth/wrong-password': 'Mật khẩu không đúng',
            'auth/invalid-credential': 'Thông tin đăng nhập không hợp lệ',
            'auth/too-many-requests': 'Quá nhiều yêu cầu. Vui lòng thử lại sau',
        };

        return errorMessages[errorCode] || 'Có lỗi xảy ra. Vui lòng thử lại';
    }

    // ==================== STATISTICS METHODS ====================

    async getMonthlyStats() {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const daysInMonth = lastDay.getDate();

            // Format dates for Firestore query
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year} -${month} -${day} `;
            };

            const firstDayStr = formatDate(firstDay);
            const lastDayStr = formatDate(lastDay);

            // Get daily summaries for the month
            const summariesRef = collection(db, 'users', userId, 'daily_summaries');
            const summariesQuery = query(
                summariesRef,
                where('date', '>=', firstDayStr),
                where('date', '<=', lastDayStr)
            );
            const summariesSnapshot = await getDocs(summariesQuery);

            let totalSteps = 0;
            let totalCalories = 0;
            summariesSnapshot.docs.forEach(doc => {
                const data = doc.data();
                totalSteps += data.steps || 0;
                totalCalories += data.calories || 0;
            });

            // Get water logs for the month
            const waterRef = collection(db, 'users', userId, 'water_logs');
            const waterQuery = query(
                waterRef,
                where('date', '>=', firstDayStr),
                where('date', '<=', lastDayStr)
            );
            const waterSnapshot = await getDocs(waterQuery);

            let totalWater = 0;
            waterSnapshot.docs.forEach(doc => {
                const data = doc.data();
                totalWater += data.amount || 0;
            });

            // Get sleep logs for the month
            const sleepRef = collection(db, 'users', userId, 'sleep_logs');
            const sleepQuery = query(
                sleepRef,
                where('date', '>=', firstDayStr),
                where('date', '<=', lastDayStr)
            );
            const sleepSnapshot = await getDocs(sleepQuery);

            let totalSleep = 0;
            sleepSnapshot.docs.forEach(doc => {
                const data = doc.data();
                totalSleep += data.total_hours || 0;
            });

            const daysWithData = Math.max(
                summariesSnapshot.size,
                waterSnapshot.size,
                sleepSnapshot.size,
                1 // Avoid division by zero
            );

            return {
                totalSteps,
                avgSteps: Math.round(totalSteps / daysInMonth),
                totalCalories,
                avgCalories: Math.round(totalCalories / daysInMonth),
                totalWater,
                avgWater: Math.round(totalWater / daysInMonth),
                totalSleep: Math.round(totalSleep * 10) / 10, // 1 decimal
                avgSleep: Math.round((totalSleep / daysInMonth) * 10) / 10,
                daysInMonth,
                daysWithData
            };
        } catch (error) {
            console.error('Error getting monthly stats:', error);
            throw new Error('Lỗi khi lấy thống kê tháng');
        }
    }

    async getConsecutiveDays() {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const settings = await this.getUserSettings();
            const summariesRef = collection(db, 'users', userId, 'daily_summaries');
            const q = query(summariesRef, orderBy('date', 'desc'), firestoreLimit(90));
            const snapshot = await getDocs(q);

            if (snapshot.empty) return 0;

            // Helper to format date
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year} -${month} -${day} `;
            };

            let consecutiveDays = 0;
            let currentDate = new Date();

            for (const doc of snapshot.docs) {
                const data = doc.data();
                const docDate = data.date;

                // Format current date to match Firestore format
                const expectedDate = formatDate(currentDate);

                if (docDate !== expectedDate) {
                    // Gap found, stop counting
                    break;
                }

                // Check if user met their goals
                const metStepsGoal = (data.steps || 0) >= (settings.daily_steps_goal || 10000);

                if (metStepsGoal) {
                    consecutiveDays++;
                    // Move to previous day
                    currentDate.setDate(currentDate.getDate() - 1);
                } else {
                    break;
                }
            }

            return consecutiveDays;
        } catch (error) {
            console.error('Error getting consecutive days:', error);
            return 0;
        }
    }

    async getWeightProgress() {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const settings = await this.getUserSettings();
            const startWeight = settings.start_weight || 0;

            // Get latest weight
            const weightLogs = await this.getWeightLogs(1);
            const currentWeight = weightLogs.length > 0 ? weightLogs[0].weight : startWeight;

            // Calculate progress (negative = weight loss)
            const progress = currentWeight - startWeight;

            return {
                startWeight,
                currentWeight,
                change: progress,
                lost: -progress // Positive number for weight lost
            };
        } catch (error) {
            console.error('Error getting weight progress:', error);
            return {
                startWeight: 0,
                currentWeight: 0,
                change: 0,
                lost: 0
            };
        }
    }

    // ==================== ACHIEVEMENTS METHODS ====================

    // Initialize default achievements (call this once to seed data)
    async initializeAchievements() {
        const achievements = [
            {
                id: 'consecutive_7',
                title: 'Người kiên trì',
                description: 'Đạt mục tiêu 4 ngày liên tiếp',
                icon: '🏆',
                type: 'consecutive_days',
                target: 4,
                points: 100
            },
            {
                id: 'consecutive_30',
                title: 'Siêu kiên trì',
                description: 'Đạt mục tiêu 15 ngày liên tiếp',
                icon: '👑',
                type: 'consecutive_days',
                target: 15,
                points: 500
            },
            {
                id: 'weight_loss_5',
                title: 'Ngôi sao giảm cân',
                description: 'Giảm được 2.5kg',
                icon: '⭐',
                type: 'weight_loss',
                target: 2.5,
                points: 200
            },
            {
                id: 'weight_loss_10',
                title: 'Chuyên gia giảm cân',
                description: 'Giảm được 5kg',
                icon: '🌟',
                type: 'weight_loss',
                target: 5,
                points: 500
            },
            {
                id: 'water_streak_7',
                title: 'Chuyên gia hydrat',
                description: 'Uống đủ nước 4 ngày liên tiếp',
                icon: '💧',
                type: 'water_streak',
                target: 4,
                points: 100
            },
            {
                id: 'sleep_streak_14',
                title: 'Bậc thầy giấc ngủ',
                description: 'Ngủ đủ giấc 7 ngày liên tiếp',
                icon: '🌙',
                type: 'sleep_streak',
                target: 7,
                points: 200
            },
            {
                id: 'steps_100k',
                title: 'Người đi bộ',
                description: 'Tổng số bước đạt 50,000',
                icon: '🚶',
                type: 'total_steps',
                target: 50000,
                points: 150
            },
            {
                id: 'activities_50',
                title: 'Người năng động',
                description: 'Hoàn thành 25 hoạt động',
                icon: '💪',
                type: 'total_activities',
                target: 25,
                points: 150
            }
        ];

        try {
            const achievementsRef = collection(db, 'achievements');
            for (const achievement of achievements) {
                await setDoc(doc(achievementsRef, achievement.id), achievement);
            }
            console.log('Achievements initialized successfully');
        } catch (error) {
            console.error('Error initializing achievements:', error);
        }
    }

    async getAchievements() {
        try {
            const achievementsRef = collection(db, 'achievements');
            const snapshot = await getDocs(achievementsRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting achievements:', error);
            return [];
        }
    }

    async getUserAchievements() {
        const userId = this.getCurrentUserId();
        if (!userId) return [];

        try {
            const userAchievementsRef = collection(db, 'users', userId, 'user_achievements');
            const snapshot = await getDocs(userAchievementsRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting user achievements:', error);
            return [];
        }
    }

    async unlockAchievement(achievementId) {
        const userId = this.getCurrentUserId();
        if (!userId) throw new Error('Chưa đăng nhập');

        try {
            const userAchievementRef = doc(db, 'users', userId, 'user_achievements', achievementId);
            await setDoc(userAchievementRef, {
                achievement_id: achievementId,
                unlocked_at: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error unlocking achievement:', error);
            return false;
        }
    }

    async checkAndUnlockAchievements() {
        const userId = this.getCurrentUserId();
        if (!userId) return [];

        try {
            const allAchievements = await this.getAchievements();
            const userAchievements = await this.getUserAchievements();
            const unlockedIds = new Set(userAchievements.map(a => a.achievement_id));
            const newlyUnlocked = [];

            for (const achievement of allAchievements) {
                // Skip if already unlocked
                if (unlockedIds.has(achievement.id)) continue;

                let shouldUnlock = false;

                switch (achievement.type) {
                    case 'consecutive_days': {
                        const consecutive = await this.getConsecutiveDays();
                        shouldUnlock = consecutive >= achievement.target;
                        break;
                    }
                    case 'weight_loss': {
                        const progress = await this.getWeightProgress();
                        shouldUnlock = progress.lost >= achievement.target;
                        break;
                    }
                    case 'water_streak': {
                        // Check water streak (simplified - check if user drank enough water for N consecutive days)
                        const settings = await this.getUserSettings();
                        const waterGoal = settings.daily_water_goal || 2000;
                        const streak = await this.checkStreak('water_logs', 'amount', waterGoal, achievement.target);
                        shouldUnlock = streak >= achievement.target;
                        break;
                    }
                    case 'sleep_streak': {
                        // Check sleep streak
                        const settings = await this.getUserSettings();
                        const sleepGoal = settings.daily_sleep_goal || 8;
                        const streak = await this.checkStreak('sleep_logs', 'total_hours', sleepGoal, achievement.target);
                        shouldUnlock = streak >= achievement.target;
                        break;
                    }
                    case 'total_steps': {
                        const monthly = await this.getMonthlyStats();
                        // Get all-time steps (simplified - just use monthly for now)
                        shouldUnlock = monthly.totalSteps >= achievement.target;
                        break;
                    }
                    case 'total_activities': {
                        const activitiesRef = collection(db, 'users', userId, 'activities');
                        const snapshot = await getDocs(activitiesRef);
                        shouldUnlock = snapshot.size >= achievement.target;
                        break;
                    }
                }

                if (shouldUnlock) {
                    await this.unlockAchievement(achievement.id);
                    newlyUnlocked.push(achievement);
                }
            }

            return newlyUnlocked;
        } catch (error) {
            console.error('Error checking achievements:', error);
            return [];
        }
    }

    // Helper method to check streaks
    async checkStreak(collectionName, field, goalValue, daysToCheck) {
        const userId = this.getCurrentUserId();
        if (!userId) return 0;

        try {
            const logsRef = collection(db, 'users', userId, collectionName);
            const q = query(logsRef, orderBy('date', 'desc'), firestoreLimit(daysToCheck * 2));
            const snapshot = await getDocs(q);

            if (snapshot.empty) return 0;

            // Helper to format date
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year} -${month} -${day} `;
            };

            // Group by date and sum values
            const dailyTotals = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const date = data.date;
                if (!dailyTotals[date]) {
                    dailyTotals[date] = 0;
                }
                dailyTotals[date] += data[field] || 0;
            });

            // Check consecutive days
            let streak = 0;
            let currentDate = new Date();

            for (let i = 0; i < daysToCheck; i++) {
                const dateStr = formatDate(currentDate);
                const total = dailyTotals[dateStr] || 0;

                if (total >= goalValue) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                } else {
                    break;
                }
            }

            return streak;
        } catch (error) {
            console.error('Error checking streak:', error);
            return 0;
        }
    }

}

export default new FirebaseApiService();

