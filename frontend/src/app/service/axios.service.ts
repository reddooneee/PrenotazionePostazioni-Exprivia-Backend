import { Injectable } from "@angular/core";
import axios from "axios";

@Injectable({
    providedIn: "root",
})
export class AxiosService {
    private baseUrl = "http://localhost:8080"; // Cambia con il tuo URL base

    constructor() { }

    // GET
    async get(url: string): Promise<any> {
        const response = await axios.get(`${this.baseUrl}${url}`);
        return response.data;
    }

    // POST
    async post(url: string, data: any): Promise<any> {
        const response = await axios.post(`${this.baseUrl}${url}`, data);
        return response.data;
    }

    // PUT
    async put(url: string, data: any): Promise<any> {
        const response = await axios.put(`${this.baseUrl}${url}`, data);
        return response.data;
    }

    // DELETE
    async delete(url: string): Promise<any> {
        const response = await axios.delete(`${this.baseUrl}${url}`);
        return response.data;
    }
}
