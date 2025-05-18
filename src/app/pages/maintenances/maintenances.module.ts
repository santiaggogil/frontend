import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenancesRoutingModule } from './maintenances-routing.module';
import { MaintenanceListComponent } from './list/list.component';
import { ManageMaintenanceComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MaintenanceListComponent,
    ManageMaintenanceComponent
  ],
  imports: [
    CommonModule,
    MaintenancesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MaintenancesModule { }
