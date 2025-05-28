import { inject, Injectable } from "@angular/core";
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { TokenService } from "../auth/token.service";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class AxiosService {
    private axiosInstance: AxiosInstance;
    private tokenService = inject(TokenService);
    private router = inject(Router);

    // Lista degli endpoint pubblici che non richiedono autenticazione
    private publicEndpoints = [
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/auth/reset-password'
    ];

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: "http://localhost:8080", // Update this with your backend URL
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Add request interceptor to add token to all requests except public endpoints
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (config.url && this.isPublicEndpoint(config.url)) {
                    return config;
                }

                const token = this.tokenService.getToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor to handle 401 errors
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error) => {
                if (error.response?.status === 401 && error.config?.url && !this.isPublicEndpoint(error.config.url)) {
                    this.tokenService.clearToken();
                    this.router.navigate(['/accedi'], {
                        queryParams: { returnUrl: this.router.url }
                    });
                }
                return Promise.reject(error);
            }
        );
    }

    // Verifica se un endpoint è pubblico
    private isPublicEndpoint(url: string): boolean {
        return this.publicEndpoints.some(endpoint => url.includes(endpoint));
    }

    // GET
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    // POST
    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    // PUT
    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    // DELETE
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }
}