import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceProcedureListComponent } from './list/list.component';
import { ManageMaintenanceProcedureComponent } from './manage/manage.component';

const routes: Routes = [
  {path:"list",component:MaintenanceProcedureListComponent},
  {path:"create",component:ManageMaintenanceProcedureComponent},
  {path:"update/:id",component:ManageMaintenanceProcedureComponent},
  {path:"view/:id",component:ManageMaintenanceProcedureComponent},
  {
    path: 'maintenanceProcedures',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/maintenance-procedures/maintenance-procedures.module').then(m => m.MaintenanceProceduresModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceProceduresRoutingModule { }
