import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private username: string;
  private password: string;
  private authenticated: boolean;
  private loggedInUser: string;
  @Output() loginEvent = new EventEmitter<{'authenticated': boolean, 'user':  string, 'loginFailed': boolean}>();

  constructor(private http: HttpClient) {
      this.authenticated = false;
   }

  authenticate(user: string, password: string){

    const options = {
      params: {'username': user, 
               'password': password}
    }
    console.log("Authenticating.")
    this.http.get('http://127.0.0.1:5000/login', options).
    subscribe((loginResp) => {
      if (loginResp['authenticated']) {
        this.loggedIn(loginResp['name']) 
      }
      else {
        this.loginFailed()
      }
    })
  }

  logout(){
    this.http.get('http://127.0.0.1:5000/logout')
    .subscribe(() => {
      this.loggedOut();
    });
  }


  loggedIn(user: string){
    this.authenticated = true;
    this.loggedInUser = user;
    const emitValue = {'authenticated': this.authenticated, 'user' :this.loggedInUser, 'loginFailed': false};
    this.loginEvent.emit(emitValue);
  }

  loggedOut() {
    this.authenticated = false;
    this.loggedInUser = '';
    const emitValue = {'authenticated': this.authenticated, 'user' : '', 'loginFailed': false};
    this.loginEvent.emit(emitValue);
    console.log('called loggedOut service')
  }

  loginFailed() {
    this.authenticated = false;
    this.loggedInUser = '';
    const emitValue = {'authenticated': this.authenticated, 'user' : '', 'loginFailed': true};
    this.loginEvent.emit(emitValue);
  }

  getUser(){
    return this.loggedInUser;
  }


  alreadyLoggedIn(){
    this.http.get('http://127.0.0.1:5000/loginState')
    .subscribe((resp) =>{
      const emitValue = {'authenticated': resp['authenticated'], 'user' : resp['name'], 'loginFailed': false};
      this.loginEvent.emit(emitValue);
      console.log("Page Refreshed ")
      console.log(resp['name'])
    })
    console.log("already logged in ")
  };
    
}
