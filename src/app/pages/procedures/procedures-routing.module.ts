import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcedureListComponent } from './list/list.component';
import { ManageProcedureComponent } from './manage/manage.component';

const routes: Routes = [
  {path:"list",component:ProcedureListComponent},
  {path:"create",component:ManageProcedureComponent},
  {path:"update/:id",component:ManageProcedureComponent},
  {path:"view/:id",component:ManageProcedureComponent},
  {
    path: 'procedures',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/procedures/procedures.module').then(m => m.ProceduresModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProceduresRoutingModule { }
