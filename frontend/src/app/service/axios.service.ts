import { inject, Injectable } from "@angular/core";
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { TokenService } from "../core/auth/token.service";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class AxiosService {
    private axiosInstance: AxiosInstance;
    private tokenService = inject(TokenService);
    private router = inject(Router);

    constructor() {
        console.log('AxiosService: Initializing...');
        this.axiosInstance = axios.create({
            baseURL: "http://localhost:8080", // Update this with your backend URL
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Add request interceptor to add token to all requests
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                console.log('AxiosService: Intercepting request:', {
                    url: config.url,
                    method: config.method
                });
                const token = this.tokenService.getToken();
                if (token && config.headers) {
                    console.log('AxiosService: Adding Authorization header with token');
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    console.log('AxiosService: No token available for request');
                }
                return config;
            },
            (error) => {
                console.error('AxiosService: Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Add response interceptor to handle 401 errors
        this.axiosInstance.interceptors.response.use(
            (response) => {
                console.log('AxiosService: Response received:', {
                    url: response.config.url,
                    status: response.status
                });
                return response.data;
            },
            (error) => {
                console.error('AxiosService: Response error:', {
                    url: error.config?.url,
                    status: error.response?.status,
                    message: error.message
                });
                if (error.response?.status === 401) {
                    console.log('AxiosService: 401 error detected, clearing token and redirecting to login');
                    this.tokenService.clearToken();
                    // Use router for navigation instead of window.location
                    this.router.navigate(['/accedi'], {
                        queryParams: { returnUrl: this.router.url }
                    });
                }
                return Promise.reject(error);
            }
        );
    }

    // GET
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        console.log('AxiosService: Making GET request to:', url);
        const response = await this.axiosInstance.get<T>(url, config);
        return response as T;
    }

    // POST
    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        console.log('AxiosService: Making POST request to:', url);
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response as T;
    }

    // PUT
    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        console.log('AxiosService: Making PUT request to:', url);
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response as T;
    }

    // DELETE
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        console.log('AxiosService: Making DELETE request to:', url);
        const response = await this.axiosInstance.delete<T>(url, config);
        return response as T;
    }
}
