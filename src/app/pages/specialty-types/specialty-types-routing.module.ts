import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialtyTypeListComponent } from './list/list.component';
import { ManageSpecialtyTypeComponent } from './manage/manage.component';

const routes: Routes = [
  {path:"list",component:SpecialtyTypeListComponent},
  {path:"create",component:ManageSpecialtyTypeComponent},
  {path:"update/:id",component:ManageSpecialtyTypeComponent},
  {path:"view/:id",component:ManageSpecialtyTypeComponent},
  {
    path: 'specialtyTypes',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/specialty-types/specialty-types.module').then(m => m.SpecialtyTypesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialtyTypesRoutingModule { }
