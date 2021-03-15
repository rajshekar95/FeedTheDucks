import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userRole : string;
  userName: string;

  constructor(private router : Router, private authService : AuthService) { }
  
  ngOnInit() {
    this.userRole = localStorage.getItem('fwRole');
    this.userName= localStorage.getItem('fwUsername');
       
  }
  navigate(val : any){
      if(val === 'dahboard'){
        this.router.navigate(['/dashboard']);
      }else if(val === 'report'){
        this.router.navigate(['/home']);
      }else if( val === 'admin'){
        this.router.navigate(['/admin']);
      }
  }
  logout(){
    this.authService.logout();
  }


}
