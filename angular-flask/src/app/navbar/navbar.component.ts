import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedInUser: string;
  isAuthenticated: Boolean = false;
  
  constructor(private auth: AuthService) { 

    this.auth.loginEvent.subscribe((loggedIn) => {
      this.isAuthenticated = loggedIn['authenticated'];
      this.loggedInUser =  loggedIn['user'];
      });
  }


  ngOnInit(): void {
  }

  logOut(){
    this.auth.logout();
  }
}
