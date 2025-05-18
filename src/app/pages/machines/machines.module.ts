import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MachinesRoutingModule } from './machines-routing.module';
import { MachineListComponent } from './list/list.component';
import { ManageMachineComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MachineListComponent,
    ManageMachineComponent
  ],
  imports: [
    CommonModule,
    MachinesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MachinesModule { }
