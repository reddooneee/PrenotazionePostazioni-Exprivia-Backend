import { Injectable } from "@angular/core";
import { AxiosService } from "@core/services/axios.service";
import { AxiosError } from "axios";

interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

@Injectable({
    providedIn: 'root'
})
export class ResetPasswordService {
    private readonly baseUrl = '/api/auth';

    constructor(private axiosService: AxiosService) {}

    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            const request: ResetPasswordRequest = {
                token,
                newPassword
            };

            await this.axiosService.post(
                `${this.baseUrl}/reset-password`,
                request
            );
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    throw new Error('Token non valido o scaduto');
                } else if (error.response?.status === 404) {
                    throw new Error('Token non trovato');
                }
            }
            throw new Error('Errore durante il reset della password');
        }
    }
}
