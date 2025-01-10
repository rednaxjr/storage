import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  // url = environment.url;
  private url= 'http://localhost:3000/api/user';
  // header = environment.headers;
  
  headers = {
    headers: new HttpHeaders().set('Content-Type', "application/json")
  }
  constructor(
    private httpClient: HttpClient
  ) { }

  getAllUsers() {
    return this.httpClient.get(this.url + "/")
  } 

  uploadFile(formData:FormData){ 
    return this.httpClient.post<any>(this.url + "/uploadFile", formData );
  }
  uploadFile2(formData:FormData){ 
    return this.httpClient.post<any>(this.url + "/uploadFile2", formData );
  }
 
}
