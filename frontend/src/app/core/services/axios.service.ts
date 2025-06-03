import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { TokenService } from '../auth/token.service';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {
  private axiosInstance: AxiosInstance;
  private tokenService = new TokenService();

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:8080',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add request interceptor to add token to all requests
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.tokenService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Ensure Content-Type is set correctly for all requests
        if (config.data && typeof config.data === 'object') {
          config.headers['Content-Type'] = 'application/json';
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle 401 errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.tokenService.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}