import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MainService } from '../main.service';
import { Users } from '../models/Users';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  displayedColumns: string[] = ['id','personFullname', 'email', 'role', 'action'];
  dataSource: MatTableDataSource<Users>;
  userStats : any;
  editaleUserId : any;
  editedRole : string;
  userRoles : string[] = ['contributor', 'scientist'];

  constructor(private service : MainService, private authService : AuthService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.editaleUserId = '';
    this.service.getAllUsers().subscribe((response: any)=>{
      if(response.status === 'success'){
        let userData :  Users[] = response.data;
        this.dataSource = new MatTableDataSource(userData);
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout(); 
        this.showSnack('E','session epired');
      }else{
        console.log(response.error)
        this.showSnack('E',response.error);
      }
    })
  }

  editUserRole(element : any){
      this.editaleUserId = element.id;
      this.editedRole = element.role
  }
  saveUserRole(element : any){
    this.service.updateUserRole({userId : element.id, role : this.editedRole}).subscribe((response: any)=>{
      if(response.status === 'success'){
        element.role = this.editedRole;
        this.editaleUserId = '';
        this.showSnack('S','Updated successfully.');
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout(); 
        this.showSnack('E','session epired');
      }else{
        console.log("error");
        this.showSnack('E',response.error);
      }
    })
  }

  close(element: any){
    this.editaleUserId = '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showSnack(type, msg) {
    this.snackbar.openFromComponent(SnackbarComponent, {
      data: {
        type: type,
        msg: msg
      },
      duration: 3000
     })
  }

}
