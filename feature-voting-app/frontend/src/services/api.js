const API_BASE_URL = 'http://10.0.2.2:3000/api'; // For Android emulator
// const API_BASE_URL = 'http://localhost:3000/api'; // For iOS simulator

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // User methods
  async loginUser(email) {
    return this.request('/users/login', {
      method: 'POST',
      body: { email },
    });
  }

  async getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  // Feature methods
  async getAllFeatures() {
    return this.request('/features');
  }

  async getUserFeatures(userId) {
    return this.request(`/features/user/${userId}`);
  }

  async createFeature(name, userId) {
    return this.request('/features', {
      method: 'POST',
      body: { name, user_id: userId },
    });
  }

  async deleteFeature(featureId, userId) {
    return this.request(`/features/${featureId}`, {
      method: 'DELETE',
      body: { user_id: userId },
    });
  }

  // Vote methods
  async toggleVote(userId, featureId) {
    return this.request('/votes/toggle', {
      method: 'POST',
      body: { user_id: userId, feature_id: featureId },
    });
  }

  async getUserVotes(userId) {
    return this.request(`/votes/user/${userId}`);
  }
}

export default new ApiService();