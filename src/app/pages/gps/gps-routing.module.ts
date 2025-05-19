import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpsListComponent } from './list/list.component';
import { ManageGpsComponent } from './manage/manage.component';

const routes: Routes = [
  {path:"list",component:GpsListComponent},
  {path:"create",component:ManageGpsComponent},
  {path:"update/:id",component:ManageGpsComponent},
  {path:"view/:id",component:ManageGpsComponent},
  {
    path: 'gps',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/gps/gps.module').then(m => m.GpsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GpsRoutingModule { }
