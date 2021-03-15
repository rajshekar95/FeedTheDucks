import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MainService } from '../main.service';
import { Foods } from '../models/Foods';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddNewFoodDialogComponent } from '../add-new-food-dialog/add-new-food-dialog.component';
import { AuthService } from '../auth.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-food-settings',
  templateUrl: './food-settings.component.html',
  styleUrls: ['./food-settings.component.scss']
})
export class FoodSettingsComponent implements OnInit {
  displayedColumns: string[] = ['typeId','kind', 'name', 'action'];
  dataSource: MatTableDataSource<Foods>;
  userStats : any; 
  editaleUserId : any;
  editedName : string;
  editedKind : string;
  userRoles : string[] = ['contributor', 'scientist'];

  constructor(private service : MainService, private dialog: MatDialog, private snackbar: MatSnackBar, private authService : AuthService) { }

  ngOnInit() {
    this.editaleUserId = '';
    this.service.getAllFoodTypes().subscribe((response: any)=>{
      if(response.status === 'success'){
        let userData :  Foods[] = response.data;
        this.dataSource = new MatTableDataSource(userData);
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout();
        this.showSnack('E','session epired');
      }else{
        console.log(response.error);this.showSnack('E',response.error);
      }
    })
  }
  edit(element : any){
    this.editaleUserId = element.typeId;
    this.editedName = element.name;
    this.editedKind = element.kind;
  }
  save(element : any){
    this.service.updateFoodType({typeId : element.typeId, name : this.editedName, kind : this.editedKind}).subscribe((response: any)=>{
     if(response.status === 'success'){
        element.name = this.editedName;
       element.kind = this.editedKind;
       this.editaleUserId = '';
       this.showSnack('S','Updated Successfully.');
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout();
        this.showSnack('E','session epired');
      }else{
       console.log("error");
       this.showSnack('E',response.error);
      }
    })
  }
  addNewType(){
    this.openDialog();
  }

  delete (element : any){
    this.service.deleteFoodType(element.typeId).subscribe((response : any)=>{
      if(response.status === 'success'){
        this.showSnack('S','Deleted Successfully.');
       this.ngOnInit();
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout();
        this.showSnack('E','session epired');
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

openDialog(){
  const dialogRef = this.dialog.open(AddNewFoodDialogComponent, {
      width: '400px',
      disableClose : true
  });

  dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      //service
      //validation
      //result.userId=1;
      if(result.kind != undefined && result.kind  != "" && result.name != undefined && result.name != '' ){
        this.service.addNewFoodType(result).subscribe((response : any) =>{
          console.log(response);
          if(response.status === 'success'){
            this.showSnack('S','Added successfully.');
            this.ngOnInit();
          }else if(response.status === 'error' && response.error === 'token expired'){
            this.authService.logout();
            this.showSnack('E','session epired');
          }
        })
      }else{
        console.log("closed");
      }
      
  });
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
