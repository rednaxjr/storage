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
  getUploadedFiles(){ 
    return this.httpClient.get<any>(this.url + "/getAllFiles" );
  } 
  
  deleteFile(data:any){ 
    return this.httpClient.post<any>(this.url + "/deleteFile" , data, this.headers);
  } 
  downloadFile(data: any) {
    return this.httpClient.get(this.url + '/downloadFile/' + data.name, {
      responseType: 'blob', // Ensures the file is downloaded as a binary blob
    });
  }
  
  viewFile(data:any){ 
    return this.httpClient.post<any>(this.url + "/viewFile"  , data, {
      // headers: this.headers,
      headers: new HttpHeaders().set('Content-Type', "application/json"),
      responseType: 'blob' as 'json'  
    });
  } 
 
}
