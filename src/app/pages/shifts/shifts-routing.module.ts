import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftListComponent } from './list/list.component';
import { ManageShiftComponent } from './manage/manage.component';

const routes: Routes = [
  {path:"list",component:ShiftListComponent},
  {path:"create",component:ManageShiftComponent},
  {path:"update/:id",component:ManageShiftComponent},
  {path:"view/:id",component:ManageShiftComponent},
  {
    path: 'shifts',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/shifts/shifts.module').then(m => m.ShiftsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftsRoutingModule { }
