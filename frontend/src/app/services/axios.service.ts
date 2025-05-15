import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:8080',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async get(url: string) {
    return this.axiosInstance.get(url);
  }

  async post(url: string, data: any) {
    return this.axiosInstance.post(url, data);
  }

  async put(url: string, data: any) {
    return this.axiosInstance.put(url, data);
  }

  async delete(url: string) {
    return this.axiosInstance.delete(url);
  }
} 