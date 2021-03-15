import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';
import {Feeds} from '../models/Feeds';
import { AuthService } from '../auth.service';
import { MainService } from '../main.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['location', 'foodName', 'foodKind', 'quantity', 'totalNumberOfDucks', 'time'];
  dataSource: MatTableDataSource<Feeds>;
  userStats : any;
  userId : string;
  userRole : string;
  statsLoaded : boolean;
  feedsLoaded : boolean;
  noDataFound : boolean;
  daysDifference : number;
  
  @ViewChild(MatSort, {static:false}) sort: MatSort;

  constructor(private dialog: MatDialog, private snackbar: MatSnackBar, private service : MainService, private route : Router, private authService : AuthService
    ) {}

  ngOnInit(){
    this.userRole = localStorage.getItem('fwRole');
    this.feedsLoaded = false;
    this.statsLoaded = false;
    this.noDataFound=true;

    if(this.userRole != 'contributor'){
      this.route.navigate(['/dashboard']); 
    }
    this.userId= localStorage.getItem('fwId');
    this.service.getUserFeeds().subscribe((response : any)=>{
      if(response.status === "success"){
        if(response.data.length > 0 ){
          let feedsData :  Feeds[] = response.data;
          this.dataSource = new MatTableDataSource(feedsData);
          this.noDataFound = false;
          this.dataSource.sort = this.sort;
        }else{
          this.showSnack ('E', "No Data Found");
        }
        
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout();
        this.showSnack ('E', "Session Expired");
      }
      else{
        this.showSnack ('E', response.error);
      }  
      this.feedsLoaded = true;    
    });

    this.service.getUserStats().subscribe((response : any) => {
        if(response.status === "success"){
          this.userStats = response.data;
          const today = new Date();
          const update = new Date(this.userStats.lastUpdate)
          const diff = today.getTime() - update.getTime();
         this.daysDifference = (Math.ceil(diff / (1000 * 60 * 60 * 24))); 
          
        }else if(response.status === 'error' && response.error === 'token expired'){
          this.authService.logout();
          this.showSnack ('E', "SessionExpired");
        }else{
          this.showSnack ('E', response.error);
        }
        this.statsLoaded = true;
    })
  }

  ngAfterViewInit() {
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addNewContribution(){
    this.openDialog();
  }

  openDialog(){
    const dialogRef = this.dialog.open(DialogComponent, {
        width: '400px',
        disableClose : true
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        //validation
        if(result.location != undefined && result.location != "" && result.foodTypeId != undefined && result.foodTypeId != "" ){
          result.userId=this.userId;
            this.service.addNewFeed(result).subscribe((response : any) =>{
            console.log(response);
            if(response.status === 'success'){
              this.ngOnInit();
              this.showSnack ('S', "Added Successfully");
            }else if(response.status === 'error' && response.error === 'token expired'){
              this.authService.logout();
              this.showSnack ('E', "Session Expired");
            }else{
              this.showSnack ('E', response.error);
            }
        })
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
