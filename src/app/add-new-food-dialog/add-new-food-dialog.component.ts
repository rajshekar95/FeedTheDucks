import { Component, OnInit, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-add-new-food-dialog',
  templateUrl: './add-new-food-dialog.component.html',
  styleUrls: ['./add-new-food-dialog.component.scss']
})
export class AddNewFoodDialogComponent implements OnInit {
  myForm: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<AddNewFoodDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.reactiveForm()
  }

  /* Reactive form */
  reactiveForm() {
    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      kind: ['', [Validators.required]]
    })
  }

  public errorHandling = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  }

  submitForm() {
    console.log(this.myForm.value)
    this.dialogRef.close(this.myForm.value);
  }
  close(){
    this.dialogRef.close();
  }

}
