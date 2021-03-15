import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  serviceURL : string;

  constructor(private http:HttpClient) { 
    this.serviceURL = "http://localhost:80/";
  }

  getHeader(){
    let token = localStorage.getItem('fwToken');
    return new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'POST')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Credentials','true')
      .set('authorization', token);
  }

  getUserFeeds(){
    const headers = this.getHeader();
    return this.http.get(this.serviceURL+"feeds/userFeeds",{headers});
  }

  getUserStats(){
    const headers = this.getHeader();
    return this.http.get(this.serviceURL+"reports/userStats",{headers});
  }

  addNewFeed( data : any){
    const headers = this.getHeader();
    return this.http.post(this.serviceURL+"feeds/addNewFeed", data, {headers});
  }

  getFoodTypeReport(){
    const headers = this.getHeader();
    return this.http.get(this.serviceURL+"reports/allFoodTypes",{headers});
  }
  getLocationReport(){
    const headers = this.getHeader();
    return this.http.get(this.serviceURL+"reports/allLocations",{headers});
  }
  getDaysReport(){
    const headers = this.getHeader();
    return this.http.get(this.serviceURL+"reports/dayStats",{headers});
  }
  getFeeds(){
    const headers = this.getHeader();
    return this.http.get(this.serviceURL+"feeds/allFeeds",{headers});
  }
  getAllUsers(){
    const headers = this.getHeader();
    return this.http.get(this.serviceURL+"users/allUsers",{headers});
  }

  updateUserRole (val : any){
    const headers = this.getHeader();
      return this.http.patch(this.serviceURL+"users/update", val, {headers});
  }

  getAllFoodTypes (){
    const headers = this.getHeader();
    return this.http.get(this.serviceURL+"foods/allFoodTypes",{headers});
  }

  getTotalQuantity (){
    const headers = this.getHeader();
    return this.http.get(this.serviceURL+"reports/quantityStats",{headers});
  }

  updateFoodType (val : any){
    const headers = this.getHeader();
    return this.http.patch(this.serviceURL+"foods/update", val, {headers});
  }

  deleteFoodType(val : any){
    const headers = this.getHeader();
    return this.http.delete(this.serviceURL+"foods/delete/"+ val, {headers});
  }

  addNewFoodType(val : any){
    const headers = this.getHeader();
    return this.http.post(this.serviceURL+"foods/addType", val, {headers});
  }
}
