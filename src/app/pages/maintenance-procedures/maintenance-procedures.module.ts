import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceProceduresRoutingModule } from './maintenance-procedures-routing.module';
import { MaintenanceProcedureListComponent } from './list/list.component';
import { ManageMaintenanceProcedureComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MaintenanceProcedureListComponent,
    ManageMaintenanceProcedureComponent
  ],
  imports: [
    CommonModule,
    MaintenanceProceduresRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MaintenanceProceduresModule { }
