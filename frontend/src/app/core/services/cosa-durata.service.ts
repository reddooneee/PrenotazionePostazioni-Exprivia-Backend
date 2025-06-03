import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AxiosService } from './axios.service';
import { CosaDurata, CosaDurataDTO } from '../models/cosa-durata.model';

@Injectable({
    providedIn: 'root'
})
export class CosaDurataService {
    private readonly BASE_URL = '/api/cose-durata';

    constructor(private axiosService: AxiosService) {}

    getAllCoseDurata(): Observable<CosaDurata[]> {
        return from(this.axiosService.get<CosaDurata[]>(this.BASE_URL));
    }

    getCosaDurataByNome(nome: string): Observable<CosaDurata> {
        return from(this.axiosService.get<CosaDurata>(`${this.BASE_URL}/${nome}`));
    }

    createCosaDurata(cosaDurata: CosaDurataDTO): Observable<CosaDurata> {
        return from(this.axiosService.post<CosaDurata>(this.BASE_URL, cosaDurata));
    }

    updateCosaDurata(nome: string, cosaDurata: CosaDurataDTO): Observable<CosaDurata> {
        return from(this.axiosService.put<CosaDurata>(`${this.BASE_URL}/${nome}`, cosaDurata));
    }

    deleteCosaDurata(nome: string): Observable<void> {
        return from(this.axiosService.delete<void>(`${this.BASE_URL}/${nome}`));
    }

    getCoseDurataByPrenotazione(prenotazioneId: number): Observable<CosaDurata[]> {
        return from(this.axiosService.get<CosaDurata[]>(`${this.BASE_URL}/prenotazione/${prenotazioneId}`));
    }
} 