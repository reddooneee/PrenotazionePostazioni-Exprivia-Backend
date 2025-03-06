import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../../model/user.model";



@Injectable()
export class UserService {

    private userUrl: string;

    constructor(private http: HttpClient){
        this.userUrl = 'http://localhost:8080/api/users'
    }

    public save (user: User) {
        return this.http.post<User>(this.userUrl, user)
    }
}