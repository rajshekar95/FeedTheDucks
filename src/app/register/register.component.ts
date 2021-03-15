import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      personFullName: ['', Validators.required],
      role : ['contributor', Validators.required],
      confirmPassword: ['', Validators.required]
    },{validator: this.checkIfMatchingPasswords('password', 'confirmPassword')});
    
     let userRole = localStorage.getItem('fwRole');
     if(userRole == 'scientist'){
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
     }else{
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
     }
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
          passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
      else {
          return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
        return;
    }
    console.log(this.f.value)
    let userData = {
      email : this.f.email.value,
      password : this.f.password.value,
      personFullName : this.f.personFullName.value,
      role : this.f.role.value
    }
    this.loading = true;
    this.authenticationService.register(userData)
        .pipe(first())
        .subscribe(
            data => {
              console.log(data);
              let userRole = localStorage.getItem('fwRole');
              if(userRole == 'scientist'){
                this.router.navigate(['/dashboard']);
              }else{
                this.router.navigate(['/home']);
              }
              this.router.navigate([this.returnUrl]);
          },
            error => {
              console.log(error);
                this.error = error.error.error;
                this.loading = false;
          });
  } 

  login(){
    this.router.navigate(['/login']);
  }

}
