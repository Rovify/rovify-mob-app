import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'https://api.rovify.io';
const TIMEOUT = 15000;

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

class ApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client-Version': Constants.expoConfig?.version || '1.0.0',
        'X-Platform': 'mobile',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { response, config } = error;

        if (response?.status === 401) {
          // Handle unauthorized - clear auth and redirect
          await this.clearAuth();
          // You might want to emit an event here to trigger logout
        }

        if (response?.status >= 500) {
          // Log server errors for monitoring
          console.error('Server Error:', {
            url: config?.url,
            method: config?.method,
            status: response?.status,
            data: response?.data,
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async setAuthToken(token: string): Promise<void> {
    this.authToken = token;
    await AsyncStorage.setItem('api_token', token);
  }

  async clearAuth(): Promise<void> {
    this.authToken = null;
    await AsyncStorage.removeItem('api_token');
  }

  async initializeAuth(): Promise<void> {
    const token = await AsyncStorage.getItem('api_token');
    if (token) {
      this.authToken = token;
    }
  }

  // Events API
  async getEvents(params?: {
    category?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    priceMin?: number;
    priceMax?: number;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    const response = await this.client.get('/events', { params });
    return response.data;
  }

  async getEventById(id: string): Promise<ApiResponse> {
    const response = await this.client.get(`/events/${id}`);
    return response.data;
  }

  async createEvent(eventData: any): Promise<ApiResponse> {
    const response = await this.client.post('/events', eventData);
    return response.data;
  }

  // Groups API
  async getGroups(): Promise<ApiResponse> {
    const response = await this.client.get('/groups');
    return response.data;
  }

  async createGroup(groupData: any): Promise<ApiResponse> {
    const response = await this.client.post('/groups', groupData);
    return response.data;
  }

  async joinGroup(groupId: string): Promise<ApiResponse> {
    const response = await this.client.post(`/groups/${groupId}/join`);
    return response.data;
  }

  // User API
  async getUserProfile(address: string): Promise<ApiResponse> {
    const response = await this.client.get(`/users/${address}`);
    return response.data;
  }

  async updateUserProfile(updates: any): Promise<ApiResponse> {
    const response = await this.client.patch('/users/profile', updates);
    return response.data;
  }

  // Cast API (XMTP Integration)
  async getConversations(): Promise<ApiResponse> {
    const response = await this.client.get('/cast/conversations');
    return response.data;
  }

  async createConversation(data: {
    participants: string[];
    title?: string;
    type: 'direct' | 'group';
  }): Promise<ApiResponse> {
    const response = await this.client.post('/cast/conversations', data);
    return response.data;
  }

  // Payments API (Base Integration)
  async createPaymentRequest(data: {
    amount: number;
    currency: string;
    recipients: string[];
    description: string;
    splitEvenly?: boolean;
  }): Promise<ApiResponse> {
    const response = await this.client.post('/payments/request', data);
    return response.data;
  }

  async getPaymentStatus(paymentId: string): Promise<ApiResponse> {
    const response = await this.client.get(`/payments/${paymentId}`);
    return response.data;
  }

  // NFT Tickets API
  async mintTickets(data: {
    eventId: string;
    quantity: number;
    recipients: string[];
    metadata?: any;
  }): Promise<ApiResponse> {
    const response = await this.client.post('/nft/mint-tickets', data);
    return response.data;
  }

  async getUserTickets(address: string): Promise<ApiResponse> {
    const response = await this.client.get(`/nft/tickets/${address}`);
    return response.data;
  }

  // Analytics API
  async trackEvent(eventName: string, properties?: any): Promise<void> {
    try {
      await this.client.post('/analytics/events', {
        event: eventName,
        properties,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Don't throw on analytics failures
      console.warn('Analytics tracking failed:', error);
    }
  }
}

export const apiService = new ApiService();