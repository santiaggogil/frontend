import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // <--- 1. IMPORTA ESTO

import { MayorsRoutingModule } from './mayors-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';


@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    MayorsRoutingModule,
    ReactiveFormsModule
  ]
})
export class MayorsModule { }
