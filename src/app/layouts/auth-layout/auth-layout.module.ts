import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthLayoutRoutes } from './auth-layout.routing';
//import { LoginComponent } from '../../pages/login-page/login/login.component';

// Importa el módulo de la página de registro para poder usar su componente
import { RegisterPageModule } from '../../pages/register-page/register-page.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    RegisterPageModule // <-- IMPORTANTE: Importa el módulo para tener acceso a RegisterComponent
  ],
  declarations: [
    //LoginComponent,
    //RegisterComponent se importa a través de RegisterPageModule
    
  ]
})
export class AuthLayoutModule { }