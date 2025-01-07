import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';


interface AuthResponse {
    token: string;
}
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private jwtHelper = new JwtHelperService();
    private apiUrl = 'http://localhost:3000/api/';
    private userSubject = new BehaviorSubject<any>(null);

    headers = {
        headers: new HttpHeaders().set('Content-Type', "application/json")
    }
    constructor(private http: HttpClient, private router: Router) {
        this.userSubject.next(localStorage.getItem('token'));
    }
    ngOnInit(): void {
        if (this.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
        }
    }

    getToken() {
        return this.userSubject.asObservable();
    } 
    login(data: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.apiUrl + "auth/loginAccount/", data, this.headers).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                this.userSubject.next(this.jwtHelper.decodeToken(response.token));
            })
        );
    }
    logout() {
        localStorage.removeItem('token');
        this.userSubject.next(null);
        this.router.navigate(['/']).then(() => {
            history.pushState(null, '', '/');
        });

    } 
    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }
        if (this.jwtHelper.isTokenExpired(token)) {
            alert("session expired")
            this.logout(); // Automatically log out if the token is expired
            return false;
        }
        return true;
    }

    getUser(): Observable<any> {
        return this.userSubject.asObservable();
    }



}