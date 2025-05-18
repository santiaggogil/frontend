import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MachinePolicyListComponent } from './list/list.component';
import { ManageMachinePolicyComponent } from './manage/manage.component';

const routes: Routes = [
  {path:"list",component:MachinePolicyListComponent},
  {path:"create",component:ManageMachinePolicyComponent},
  {path:"update/:id",component:ManageMachinePolicyComponent},
  {path:"view/:id",component:ManageMachinePolicyComponent},
  {
    path: 'machinePolicies',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/machine-policies/machine-policies.module').then(m => m.MachinePoliciesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachinePoliciesRoutingModule { }
