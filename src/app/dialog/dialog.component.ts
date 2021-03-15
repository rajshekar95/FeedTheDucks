import { Component, OnInit, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Foods } from '../models/Foods';
import { MainService } from '../main.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  myForm: FormGroup;
  foodTypes : any ;
  foodKind : string;
  selected : string;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private service: MainService, private authService : AuthService) {}

  ngOnInit(): void {
    this.reactiveForm();
    this.service.getAllFoodTypes().subscribe((response : any)=>{
      if(response.status === 'success'){
        this.foodTypes = response.data;
      }else if(response.status === 'error' && response.error === 'token expired'){
        this.authService.logout();
      }else{
        console.log(response.error)
      }
     
    })
    
  }

  /* Reactive form */
  reactiveForm() {
    this.myForm = this.fb.group({
      location: ['', [Validators.required]],
      totalNoOfDucks: [0, [Validators.required]],
      quantity: [0, [Validators.required]],
      foodTypeId: ['', [Validators.required]],
      scheduler : [false]
    })
  }

  public errorHandling = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  }

  submitForm() {
    console.log(this.myForm.value)
    this.dialogRef.close(this.myForm.value);
  }

  setFoodType(){
    let obj = this.foodTypes.find(o => o.typeId ===  this.myForm.value.foodTypeId);
    this.foodKind = obj.kind
  } 

  close(){
    this.dialogRef.close();
  }

}