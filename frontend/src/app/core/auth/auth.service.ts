import { Injectable } from "@angular/core";
import { AxiosService } from "../../service/axios.service";
import { login } from "../../model/login.model";


@Injectable({
    providedIn: "root",
})

export class AuthService {
    constructor(private axiosService: AxiosService) { }

    async login(credentials: { login: string; password: string }): Promise<login> {
        return this.axiosService.post("/login", credentials);
    }

}