/**
 * API client for ForbrugerAgenten (Unified Platform)
 */
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4332'

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add user_id to all requests (mock auth for now - will be replaced by Auth0 token)
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('user_id')
  if (userId) {
    if (!config.params) {
      config.params = {}
    }
    // Only add if not already present
    if (!config.params.user_id) {
      config.params.user_id = userId
    }
  }
  return config
})

// API endpoints
export const apiClient = {
  // Users
  users: {
    login: (data: any) => api.post('/users/login', data),
    create: (data: any) => api.post('/users/', data),
    getMe: (userId: string) => api.get(`/users/me?user_id=${userId}`),
    update: (userId: string, data: any) => api.patch(`/users/${userId}`, data),
    updateConsent: (userId: string, data: any) => api.post(`/users/${userId}/consent`, data),
  },

  // Contracts (Unified)
  contracts: {
    list: (userId: string) => api.get(`/contracts/?user_id=${userId}`),
    create: (data: any) => api.post('/contracts/', data),
    get: (id: string) => api.get(`/contracts/${id}`),
    update: (id: string, data: any) => api.patch(`/contracts/${id}`, data),
    delete: (id: string) => api.delete(`/contracts/${id}`),
  },

  // Quotes (Unified)
  quotes: {
    list: (userId: string) => api.get(`/quotes/?user_id=${userId}`),
    getRequests: (userId: string) => api.get(`/quotes/requests?user_id=${userId}`),
    createRequest: (data: any) => api.post('/quotes/requests', data),
  },

  // Providers
  providers: {
    list: (category?: string) => api.get(category ? `/providers/?category=${category}` : '/providers/'),
  },

  // Support & Activity
  support: {
    createTicket: (data: any) => api.post('/support/tickets', data),
    getTickets: (userId: string) => api.get(`/support/tickets?user_id=${userId}`),
    addMessage: (ticketId: string, message: string) => api.post(`/support/tickets/${ticketId}/message`, { message }),
  },
  activity: {
    getFeed: (userId: string) => api.get(`/activity/?user_id=${userId}`),
  },

  // Spot Prices (V1.5)
  spotPrices: {
    range: (area: string, start: string, end: string) => 
      api.get(`/spot-prices/range?area=${area}&start_date=${start}&end_date=${end}`),
    current: (area: string) => api.get(`/spot-prices/current/${area}`),
    today: (area: string) => api.get(`/spot-prices/today/${area}`),
  }
}
