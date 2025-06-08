import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from './login-page-routing.module';
import { VerifyCodeComponent } from './verify-code/verify-code.component';



@NgModule({
  declarations: [
    LoginComponent,
    VerifyCodeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoginRoutingModule//,
    //NgbModule
  ]
})
export class LoginPageModule { }
