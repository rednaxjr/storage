import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


interface AuthResponse {
    token: string;
}
@Injectable({
    providedIn: 'root',
})
export class DateService {


    constructor(
        private http: HttpClient,
        private router: Router
    ) {

    }
    ngOnInit(): void {

    }
    async getYears() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const years = [];
    
        for (let i = 0; i < 10; i++) {
            const year = currentYear - i;
            years.push({
                value: year,
                name: year.toString()
            });
        }
        return await years; 
    }

    async getMonths() {
        const months = [];
        const date = new Date(2024, 0, 1); 
    
        for (let i = 0; i < 12; i++) {
            date.setMonth(i); 
            months.push({
                value: i,
                name: date.toLocaleString('default', { month: 'long' })
            });
        }
        return await months;
    }




}