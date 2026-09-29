import apiClient from './axiosClient';

export const authService = {
  /**
   * Log in user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} { token, email, role }
   */
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register new user (Student or Recruiter)
   * @param {Object} userData - { name, email, password, role, collegeName?, interests? }
   * @returns {Promise<string>} Success message
   */
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Clears session
   */
  logout() {
    localStorage.removeItem('gigmate_token');
    localStorage.removeItem('gigmate_user');
  },
};

export default authService;
