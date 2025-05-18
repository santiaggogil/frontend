import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceTypesRoutingModule } from './service-types-routing.module';
import { ServiceTypeListComponent } from './list/list.component';
import { ManageServiceTypeComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ServiceTypeListComponent,
    ManageServiceTypeComponent
  ],
  imports: [
    CommonModule,
    ServiceTypesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ServiceTypesModule { }
