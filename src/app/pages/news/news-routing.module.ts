import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageNewComponent } from './manage/manage.component';
import { NewsListComponent } from './list/list.component';

const routes: Routes = [
  {path:"list",component:NewsListComponent},
  {path:"create",component:ManageNewComponent},
  {path:"update/:id",component:ManageNewComponent},
  {path:"view/:id",component:ManageNewComponent},
  {
    path: 'news',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/news/news.module').then(m => m.NewsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
