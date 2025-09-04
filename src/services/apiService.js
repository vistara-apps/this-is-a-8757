import { apiClient } from '../utils/apiClient.js';

class ApiService {
  // Authentication
  async register(email, password) {
    return apiClient.post('/auth/register', { email, password });
  }

  async login(email, password) {
    return apiClient.post('/auth/login', { email, password });
  }

  async logout() {
    return apiClient.post('/auth/logout');
  }

  async getProfile() {
    return apiClient.get('/auth/profile');
  }

  async refreshToken(refreshToken) {
    return apiClient.post('/auth/refresh-token', { refresh_token: refreshToken });
  }

  // File Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getUserImages(limit = 20, offset = 0) {
    return apiClient.get(`/upload?limit=${limit}&offset=${offset}`);
  }

  async deleteImage(filename) {
    return apiClient.delete(`/upload/${filename}`);
  }

  async getStorageUsage() {
    return apiClient.get('/upload/usage');
  }

  // Payments
  async createPaymentIntent(metadata = {}) {
    return apiClient.post('/payments/create-payment-intent', { metadata });
  }

  async confirmPayment(paymentIntentId) {
    return apiClient.post('/payments/confirm-payment', { paymentIntentId });
  }

  async getPaymentMethods() {
    return apiClient.get('/payments/payment-methods');
  }

  // Ad Generation
  async generateAds(imageUrl, platforms, productContext = {}) {
    return apiClient.post('/ads/generate', {
      imageUrl,
      platforms,
      productContext
    });
  }

  async getCampaigns(limit = 10, offset = 0) {
    return apiClient.get(`/ads/campaigns?limit=${limit}&offset=${offset}`);
  }

  async getCampaignVariations(campaignId) {
    return apiClient.get(`/ads/campaigns/${campaignId}/variations`);
  }

  // Social Media
  async postToSocial(variationId, platform) {
    return apiClient.post('/social/post', {
      variationId,
      platform
    });
  }

  async getSocialAccounts() {
    return apiClient.get('/social/accounts');
  }

  // Analytics
  async getCampaignAnalytics(campaignId) {
    return apiClient.get(`/analytics/campaigns/${campaignId}`);
  }

  async getAnalyticsOverview() {
    return apiClient.get('/analytics/overview');
  }
}

export default new ApiService();
