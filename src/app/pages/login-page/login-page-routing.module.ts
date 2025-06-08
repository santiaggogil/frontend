import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';

const routes: Routes = [
  {path:"login",component:LoginComponent},
  {path:"verify-code",component:VerifyCodeComponent },
  {
    path: 'login',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/login-page/login-page.module').then(m => m.LoginPageModule)
      }
    ]
  },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
