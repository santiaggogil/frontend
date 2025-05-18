import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import { NewsListComponent } from './list/list.component';
import { ManageNewComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NewsListComponent,
    ManageNewComponent
  ],
  imports: [
    CommonModule,
    NewsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NewsModule { }
