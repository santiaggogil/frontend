import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // <--- 1. IMPORTA ESTO

import { ReviewsRoutingModule } from './reviews-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';


@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    ReviewsRoutingModule,
    ReactiveFormsModule
  ]
})
export class ReviewsModule { }
