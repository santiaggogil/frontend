import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // <--- 1. IMPORTA ESTO
import { RegisterComponent } from './register/register.component';
import { RegisterRoutingModule } from './register-page-routing.module';



@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegisterRoutingModule
  ]
})
export class RegisterPageModule { }
