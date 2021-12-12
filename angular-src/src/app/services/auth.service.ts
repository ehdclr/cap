import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Login, User, UserNoPW } from '../models/User';
import { reUser } from '../models/reUser';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authToken: any;
  user: User;
  reuser: reUser;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {}

  prepEndpoint(ep) {
    // 1. 로컬 서버에서 개발시
    return 'http://localhost:4000/' + ep;

    // // 2. 클라우드 서버에서 운영시
    // return ep;
  }

  //회원가입
  registerUser(user: User): Observable<any> {
    const registerUrl = 'http://localhost:4000/users/register';
    return this.http.post<any>(registerUrl, user, httpOptions);
  }
  authenticateUser(login: Login): Observable<any> {
    const loginUrl = 'http://localhost:4000/users/authenticate';
    return this.http.post<any>(loginUrl, login, httpOptions);
  }
  storeUserData(token: any, userNoPW: UserNoPW) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userNoPW', JSON.stringify(userNoPW));
  }
  //예약하기
  reserveUser(reuser: reUser): Observable<any> {
    const reregisterUrl = 'http://localhost:4000/users/homecustomer';
    return this.http.post<any>(reregisterUrl, reuser, httpOptions);
  }

  
  logout() {
    // localStorage.clear();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userNoPW');
  }
  getProfile(): Observable<any> {
    let authToken: any = localStorage.getItem('authToken');
    // 토큰을 포함한 헤더 옵션 생성
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authToken,
      }),
    };
    const profileUrl = 'http://localhost:4000/users/profile';
    return this.http.get<any>(profileUrl, httpOptions1);
  }

  loggedIn(): boolean {
    let authToken: any = localStorage.getItem('authToken');
    return !this.jwtHelper.isTokenExpired(authToken);
  }
  

  getList(): Observable<any> {
    
    const httpOptions1 = {
      headers: new HttpHeaders({
        contentType: 'application/json',
        
      }),
    };
    const listUrl = 'http://localhost:4000/users/homecustomer';
    return this.http.get(listUrl, httpOptions1);
  }

  // 삭제
  API_URL: string = this.prepEndpoint('users/homestore');

  getCustomers() {
    return this.http.get<User[]>(this.API_URL, httpOptions);
  }

  getCustomerinfo(): Observable<any> {
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
            }),
          };

    const customerinfoUrl = 'http://localhost:4000/users/customer_reserve';
    return this.http.get<any>(customerinfoUrl, httpOptions1);
  }

  // deleteCustomer(id: string) {
  //   const deleteCustomer = this.prepEndpoint('cusnum/cus_nums/');
  //   return this.http
  //     .delete<User>(deleteCustomer + `${id}`, httpOptions)
  //     .subscribe();
  // }

  deleteCustomer_1(id: string){
    const reregisterUrl = 'http://localhost:4000/users/homecustomer/';
    return this.http.delete<reUser>(reregisterUrl +`${id}`, httpOptions).subscribe();
  }

  //QR 등록
  authenticateQRcustomer(request): Observable<any> {
    const loginUrl= 'http://localhost:4000/users/QRcustomers';
    return this.http.post(loginUrl, request, httpOptions);
  }





}


  

