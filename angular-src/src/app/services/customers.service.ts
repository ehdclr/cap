import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';
import { Users } from '../models/cus.num';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
//회원 목록
@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private http: HttpClient) {}

  prepEndpoint(ep) {
    // 1. localhost에 포팅시
    // return 'http://localhost:3000/' + ep;

    // 2. Heroku 클라우드 서버에 포팅시
    return ep;
  }

  API_URL: string = this.prepEndpoint('users/homestore');

  getCustomers() {
    return this.http.get<Users[]>(this.API_URL, httpOptions);
  }

  deleteCustomer(id: string) {
    return this.http
      .delete<Users>(this.API_URL + `${id}`, httpOptions)
      .subscribe();
  }
}
