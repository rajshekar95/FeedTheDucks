import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AuthService} from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService) { 
      if (this.authenticationService.currentUserValue) {
        let userRole = localStorage.getItem('fwRole');
        
        if(userRole == 'scientist'){
          this.router.navigate(['/dashboard']);
        }else{
          this.router.navigate(['/home']);
        }
      }
    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    
     let userRole = localStorage.getItem('fwRole');
     if(userRole == 'scientist'){
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
     }else{
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
     }
    
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {
              let userRole = localStorage.getItem('fwRole');
              if(userRole == 'scientist'){
                this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
              }else{
                this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
              }
              this.router.navigate([this.returnUrl]);
          },
            error => {
                this.error = error.error.error;
                this.loading = false;
          });
  } 
  register(){
    this.router.navigate(['/register']);
  }



}
