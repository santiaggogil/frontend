import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';


const routes: Routes = [
{path:"list",component:ListComponent},
{path:"create",component:ManageComponent},
{path:"update/:id",component:ManageComponent},
{path:"view/:id",component:ManageComponent},
{
  path: 'mayors',
  children: [
    {
      path: '',
      loadChildren: () => import('src/app/pages/mayors/mayors.module').then(m => m.MayorsModule)
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MayorsRoutingModule { }
