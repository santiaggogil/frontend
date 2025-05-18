import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftsRoutingModule } from './shifts-routing.module';
import { ShiftListComponent } from './list/list.component';
import { ManageShiftComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ShiftListComponent,
    ManageShiftComponent
  ],
  imports: [
    CommonModule,
    ShiftsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ShiftsModule { }
