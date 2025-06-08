import { Routes } from '@angular/router';
import { LoginComponent } from '../../pages/login-page/login/login.component';
import { RegisterComponent } from '../../pages/register-page/register/register.component';

// Estas son las rutas que se cargarán dentro del AuthLayout
export const AuthLayoutRoutes: Routes = [
    { path: 'login',    component: LoginComponent },
    { path: 'register', component: RegisterComponent }
];