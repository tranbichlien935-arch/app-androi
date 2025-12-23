import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your computer's IP address when testing on physical device
// For Android Emulator: use 10.0.2.2
// For iOS Simulator: use localhost
const API_BASE_URL = 'http://10.0.2.2:3000';

class ApiService {
  async getToken() {
    return await AsyncStorage.getItem('authToken');
  }

  async setToken(token) {
    await AsyncStorage.setItem('authToken', token);
  }

  async removeToken() {
    await AsyncStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const token = await this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Có lỗi xảy ra');
    }

    return data;
  }

  // Auth
  async register(fullName, email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });
    
    if (data.token) {
      await this.setToken(data.token);
    }
    
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      await this.setToken(data.token);
    }
    
    return data;
  }

  async logout() {
    await this.removeToken();
  }

  // Habits
  async getHabits() {
    return await this.request('/habits');
  }

  async createHabit(name, description, color) {
    return await this.request('/habits', {
      method: 'POST',
      body: JSON.stringify({ name, description, color }),
    });
  }

  async updateHabit(id, name, description, color) {
    return await this.request(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description, color }),
    });
  }

  async deleteHabit(id) {
    return await this.request(`/habits/${id}`, {
      method: 'DELETE',
    });
  }

  async checkinHabit(id) {
    return await this.request(`/habits/${id}/checkin`, {
      method: 'POST',
    });
  }

  // Stats
  async getStats() {
    return await this.request('/stats');
  }
}

export default new ApiService();
