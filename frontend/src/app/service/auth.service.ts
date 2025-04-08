import { Injectable } from "@angular/core";
import { AxiosService } from "./axios.service";
import { User } from "../model/user.model";
import { login } from "../model/login.model";

@Injectable({
    providedIn: "root",
  })
  export class AuthService {
    private endpoint = "/login";
  
    constructor(private axiosService: AxiosService) {}
  
    async login(user: login): Promise<any> {
      return this.axiosService.post(this.endpoint, user);
    }
  }
  