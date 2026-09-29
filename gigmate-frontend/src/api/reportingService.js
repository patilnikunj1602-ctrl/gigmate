import apiClient from './axiosClient';

export const reportingService = {
  /**
   * Fetch gig history / summary for student dashboard statistics
   * @param {string} status - Filter by status (default: 'COMPLETED')
   */
  async getStudentSummary(status = 'COMPLETED') {
    const response = await apiClient.get('/reporting/student/summary', {
      params: { status },
    });
    return response.data;
  },

  /**
   * Download generated PDF certificate for a completed gig application
   * @param {number|string} applicationId
   * @returns {Promise<Blob>}
   */
  async downloadCertificateBlob(applicationId) {
    const response = await apiClient.get(`/reporting/certificate/${applicationId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Helper utility to trigger file download in browser
   * @param {number|string} applicationId
   * @param {string} gigTitle
   */
  async downloadCertificateFile(applicationId, gigTitle = 'Volunteer') {
    const blob = await this.downloadCertificateBlob(applicationId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedTitle = gigTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.setAttribute('download', `GigMate_Certificate_${sanitizedTitle}_${applicationId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default reportingService;
