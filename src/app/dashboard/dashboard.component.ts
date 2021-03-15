import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
import {MatTableDataSource} from '@angular/material/table';
import {  MatSnackBar } from '@angular/material';
import { MainService } from '../main.service';
import { Feeds } from '../models/Feeds';
import * as XLSX from 'xlsx';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../snackbar/snackbar.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterViewInit {

  displayedColumns: string[] = ['personFullName', 'location', 'date', 'quantity', 'totalNumberOfDucks', 'foodName', 'foodKind'];
  dataSource: MatTableDataSource<Feeds>;
  userRole : string;
  @ViewChild('TABLE', {static:false}) table: ElementRef;
  public chartOptions: ChartOptions = {
    responsive: false,
    plugins :{
      render: "percentage",
      fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    },
    legend: { position: 'bottom' }

  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(0,0,255,0.3)',
    },
  ];

  public locationPieChartLabels: Label[];
  public foodTypePieChartLabels: Label[];
  public lineChartLabels: Label[];

  public locationPieChartData: SingleDataSet;
  public foodTypePieChartData: SingleDataSet  
  public lineChartData: ChartDataSets[];

  public pieChartType: ChartType = 'doughnut';
  public lineChartType: ChartType = 'line';


  public chartLegend = true;
  public chartPlugins = [];
  foodTypePieChartReady : boolean = false;
  locationPieChartReady: boolean = false;
  datesLineChartReady: boolean = false;

  foodTypeLoaded : boolean;
  locationLoaded : boolean;
  daysLoaded : boolean;
  feedsLoaded : boolean;

  totalQuantity : string;
  totalContributors : string
  constructor(private service : MainService, private authService : AuthService, private route : Router, private snackbar :  MatSnackBar) { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.feedsLoaded = false ;
    this.foodTypeLoaded = false;
    this.locationLoaded  = false
    this.daysLoaded = false;
    this.userRole = localStorage.getItem('fwRole');
    if(this.userRole != 'scientist'){
      this.route.navigate(['\home']);
    }
    //foodTypeReport
    this.service.getFoodTypeReport().subscribe((response : any)=>{
      if(response.status === 'success'){
         const chartData = []; const labelData = [];
        for(let i=0; i< response.data.length; i++){
          chartData.push(response.data[i].count);
          labelData.push(response.data[i].foods[0].name);
        }
        this.foodTypePieChartLabels= labelData;
        this.foodTypePieChartData = chartData;
        this.foodTypePieChartReady = true;
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout();
        this.showSnack('E','session expired');
      }else{
       this.showSnack('E',response.error);
      }
      this.foodTypeLoaded = true;
    })
    //total quantity
    this.service.getAllUsers().subscribe((response : any)=>{
      if(response.status === 'success'){
        this.totalContributors = response.data.length
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout();
        this.showSnack('E','Session Expired');
      }else{
        this.showSnack('E',response.error);
      }
      this.locationLoaded = true
    })
    //total contributors
    this.service.getTotalQuantity().subscribe((response : any)=>{
      if(response.status === 'success'){
        this.totalQuantity = response.data[0].totalQuantity
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout();
        this.showSnack('E','Session Expired');
      }else{
        this.showSnack('E',response.error);
      }
      this.locationLoaded = true
    })

    //location report
    this.service.getLocationReport().subscribe((response : any)=>{
      if(response.status === 'success'){
         const chartData = []; const labelData = [];
        for(let i=0; i< response.data.length; i++){
          chartData.push(response.data[i].count);
          labelData.push(response.data[i].location);
        }
        this.locationPieChartLabels= labelData;
        this.locationPieChartData = chartData;
        this.locationPieChartReady = true;
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout();
        this.showSnack('E','Session Expired');
      }else{
        this.showSnack('E',response.error);
      }
      this.locationLoaded = true
    })

    //date report
    this.service.getDaysReport().subscribe((response : any)=>{
      if(response.status === 'success'){
         const chartData = []; const labelData = [];
        for(let i=0; i< response.data.length; i++){
          chartData.push(response.data[i].count);
          console.log(new DatePipe("en-US").transform(response.data[i].time, 'dd/MM/yyyy'))
          labelData.push(new DatePipe("en-US").transform(response.data[i].time, 'dd/MM/yyyy'));
        }
        this.lineChartLabels= labelData;
        this.lineChartData = [{data: chartData, label  : 'Dates' }];
        this.datesLineChartReady = true;
      }else if(response.status === 'error' && response.error === 'token expired'){
         this.authService.logout();
         this.showSnack('E','session expired');
      }else{
        this.showSnack('E',response.error);
      }
      this.daysLoaded = true;
    })

    //reports table
    this.service.getFeeds().subscribe((response : any)=>{
      if(response.status === "success"){
        let feedsData :  Feeds[] = response.data;
        this.dataSource = new MatTableDataSource(feedsData);
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout();
        this.showSnack('E','session expired');
      }else{
        this.showSnack('E',"no data found for this User")
      }      
    });
   this.feedsLoaded = true;
  }

  ngAfterViewInit(){
   
  }

  exportAsExcel(){
      const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, 'Report.xlsx');

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
