
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
{path:"create",component:RegisterComponent},
{
  path: 'register',
  children: [
    {
      path: '',
      loadChildren: () => import('src/app/pages/register-page/register-page.module').then(m => m.RegisterPageModule)
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
