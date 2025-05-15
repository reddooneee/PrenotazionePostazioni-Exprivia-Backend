import { Injectable } from '@angular/core';
import { AxiosService } from '@core/services/axios.service';
import { AxiosError } from 'axios';

interface ForgotPasswordRequest {
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class ForgotPasswordService {
    private readonly baseUrl = '/api/auth';

    constructor(private axiosService: AxiosService) {}

    async forgotPassword(email: string): Promise<void> {
        try {
            const request: ForgotPasswordRequest = { email };
            
            await this.axiosService.post(
                `${this.baseUrl}/forgot-password`,
                request
            );
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    throw new Error('Email non trovata');
                } else if (error.response?.status === 400) {
                    throw new Error('Email non valida');
                }
            }
            throw new Error('Errore durante la richiesta di recupero password');
        }
    }
}
