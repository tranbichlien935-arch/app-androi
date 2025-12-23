import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
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
            const q = query(weightRef, orderBy('date', 'desc'), firestoreLimit(limitCount));
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
            return data;
        } catch (error) {
            throw new Error('Lỗi khi cập nhật thông tin');
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
}

export default new FirebaseApiService();
