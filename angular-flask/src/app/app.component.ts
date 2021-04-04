import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { FilterService } from './filter.service';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {


  dropDownStatus: Boolean = false;
  isAuthenticated: Boolean = false;
  loginFailed: Boolean = false;
  loggedInUser: string;

  constructor(private http: HttpService,
             private filter: FilterService,
             private auth: AuthService) {
    
    this.auth.alreadyLoggedIn();

    this.auth.loginEvent.subscribe((loggedIn) => {
      console.log("called")
      this.isAuthenticated = loggedIn['authenticated'];
      this.loggedInUser = loggedIn['user'];
      this.loginFailed = loggedIn['loginFailed'];
    })

    this.filter.dropDownEvent.subscribe(
      (status: boolean) => {
        this.dropDownStatus = status;
      }
    )
  }

  ngOnInit(){

  }

}
