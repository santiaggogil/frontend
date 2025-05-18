import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageServiceTypeComponent } from './manage/manage.component';
import { ServiceTypeListComponent } from './list/list.component';

const routes: Routes = [
  {path:"list",component:ServiceTypeListComponent},
  {path:"create",component:ManageServiceTypeComponent},
  {path:"update/:id",component:ManageServiceTypeComponent},
  {path:"view/:id",component:ManageServiceTypeComponent},
  {
    path: 'serviceTypes',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/service-types/service-types.module').then(m => m.ServiceTypesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceTypesRoutingModule { }
