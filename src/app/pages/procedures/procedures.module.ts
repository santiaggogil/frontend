import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProceduresRoutingModule } from './procedures-routing.module';
import { ProcedureListComponent } from './list/list.component';
import { ManageProcedureComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProcedureListComponent,
    ManageProcedureComponent
  ],
  imports: [
    CommonModule,
    ProceduresRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProceduresModule { }
