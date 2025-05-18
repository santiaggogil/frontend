import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MachineListComponent } from './list/list.component';
import { ManageMachineComponent } from './manage/manage.component';

const routes: Routes = [
  {path:"list",component:MachineListComponent},
  {path:"create",component:ManageMachineComponent},
  {path:"update/:id",component:ManageMachineComponent},
  {path:"view/:id",component:ManageMachineComponent},
  {
    path: 'machines',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/machines/machines.module').then(m => m.MachinesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachinesRoutingModule { }
