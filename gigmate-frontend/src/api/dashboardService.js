import apiClient from './axiosClient';

export const dashboardService = {
  // ==========================================
  // 🎓 STUDENT SERVICES
  // ==========================================

  /**
   * Toggle or add a student's free day
   * @param {string} date - ISO date string YYYY-MM-DD
   */
  async toggleFreeDay(date) {
    const response = await apiClient.post(`/dashboard/student/free-days?date=${date}`);
    return response.data;
  },

  /**
   * Fetch registered free availability days for logged in student
   */
  async getMyFreeDays() {
    const response = await apiClient.get('/dashboard/student/free-days');
    return response.data;
  },

  /**
   * Search and match gigs by date and category
   * @param {string} date - ISO date string YYYY-MM-DD
   * @param {string} category - Category string (e.g. 'Tech', 'Concerts', 'NGOs')
   */
  async getMatchedGigs(date, category) {
    const response = await apiClient.get('/dashboard/student/gigs/match', {
      params: { date, category },
    });
    return response.data;
  },

  /**
   * Apply for a gig
   * @param {number|string} gigId - ID of the gig
   */
  async applyToGig(gigId) {
    const response = await apiClient.post(`/dashboard/student/gigs/${gigId}/apply`);
    return response.data;
  },

  /**
   * Fetch student's submitted gig applications
   */
  async getMyApplications() {
    const response = await apiClient.get('/dashboard/student/applications');
    return response.data;
  },

  // ==========================================
  // 💼 RECRUITER SERVICES
  // ==========================================

  /**
   * Post a new gig campaign
   * @param {Object} gigData - { title, description, category, gigDate, quota }
   */
  async postGig(gigData) {
    const response = await apiClient.post('/dashboard/recruiter/gigs', gigData);
    return response.data;
  },

  /**
   * Get all gigs created by the current recruiter
   */
  async getRecruiterGigs() {
    const response = await apiClient.get('/dashboard/recruiter/gigs');
    return response.data;
  },

  /**
   * Get all applicant applications for a specific gig
   * @param {number|string} gigId
   */
  async getGigApplications(gigId) {
    const response = await apiClient.get(`/dashboard/recruiter/gigs/${gigId}/applications`);
    return response.data;
  },

  /**
   * Update student application status (APPROVED, HIRED, REJECTED, COMPLETED)
   * @param {number|string} applicationId
   * @param {string} status
   */
  async updateApplicationStatus(applicationId, status) {
    const response = await apiClient.put(
      `/dashboard/recruiter/applications/${applicationId}/status?status=${encodeURIComponent(status)}`
    );
    return response.data;
  },
};

export default dashboardService;
