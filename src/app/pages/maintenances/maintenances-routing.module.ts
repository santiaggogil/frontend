import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceListComponent } from './list/list.component';
import { ManageMaintenanceComponent } from './manage/manage.component';

const routes: Routes = [
  {path:"list",component:MaintenanceListComponent},
  {path:"create",component:ManageMaintenanceComponent},
  {path:"update/:id",component:ManageMaintenanceComponent},
  {path:"view/:id",component:ManageMaintenanceComponent},
  {
    path: 'maintenances',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/maintenances/maintenances.module').then(m => m.MaintenancesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenancesRoutingModule { }
