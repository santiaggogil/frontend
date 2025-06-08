import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register-page/register/register.component';
import { NoAuthenticatedGuard } from 'src/app/guards/no-authenticated.guard';
import { log } from 'console';

// export const AuthLayoutRoutes: Routes = [
//     { path: 'login', canActivate: [NoAuthenticatedGuard] },
//     { path: 'register', canActivate: [NoAuthenticatedGuard]}
// ];

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
];