import { HttpHeaders, HttpClient } from "@angular/common/http"; 

export const environment = {
    production:false,
    url:"http://localhost:3000/",
    headers:{
        headers: new HttpHeaders().set('Content-Type', "application/json")
    }
};
