import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperatorPolicyListComponent } from '../operator-policies/list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  {path:"list",component:OperatorPolicyListComponent},
  {path:"create",component:ManageComponent},
  {path:"update/:id",component:ManageComponent},
  {path:"view/:id",component:ManageComponent},
  {
    path: 'operatorPolicies',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/operator-policies/operator-policies.module').then(m => m.OperatorPoliciesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorPoliciesRoutingModule { }
