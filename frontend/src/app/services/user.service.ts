import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.url;
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
  registerAccount(data: any) {
    return this.httpClient.post(this.url + "/insertData", data, this.headers)
  }
  updateUser(data: any) {
    return this.httpClient.post(this.url + "/updateById", data, this.headers)
  }
  
  deleteAccount(data: any) {
    return this.httpClient.post(this.url + "/deleteById/",data)
  }
  getUserTimeLogById(data: any) {
    return this.httpClient.post(this.url + "/getUserTimeLogById/",data)
  }
  getUserTodayLogsById(data: any) {
    return this.httpClient.post(this.url + "/getUserTodayLogsById/",data)
  }
  getTLByDate(data: any) {
    return this.httpClient.post(this.url + "/getTLByDate/",data)
  }

  getReportsByDate(data: any) {
    return this.httpClient.post(this.url + "/getReportsByDate/",data)
  }
  
  
  // loginAccount(data:any){
  //   return this.httpClient.post(this.url + "/loginAccount/",data, this.headers)
  // }
 
  // (){
  //   return this.httpClient.get()
  // }


}
