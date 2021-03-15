import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userRole : string;
  constructor(private route : Router) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('fwRole');
    if(this.userRole != 'scientist'){
      this.route.navigate(['/home']);
    }
  }

}
