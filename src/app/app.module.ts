//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

//Service
import { MainService } from './main.service';
import { AuthService } from './auth.service';
import { ChartsModule, ThemeService } from 'ng2-charts';

//Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DialogComponent } from './dialog/dialog.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { FoodSettingsComponent } from './food-settings/food-settings.component';
import { AddNewFoodDialogComponent } from './add-new-food-dialog/add-new-food-dialog.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DialogComponent,
    HeaderComponent,
    DashboardComponent,
    AdminComponent,
    UserSettingsComponent,
    FoodSettingsComponent,
    AddNewFoodDialogComponent,
    LoginComponent,
    RegisterComponent,
    SnackbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule, 
    ChartsModule
  ],
  providers: [MainService, ThemeService, AuthService],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent, AddNewFoodDialogComponent, SnackbarComponent]
})
export class AppModule { }
