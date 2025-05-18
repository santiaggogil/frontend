import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialtyTypesRoutingModule } from './specialty-types-routing.module';
import { SpecialtyTypeListComponent } from './list/list.component';
import { ManageSpecialtyTypeComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SpecialtyTypeListComponent,
    ManageSpecialtyTypeComponent
  ],
  imports: [
    CommonModule,
    SpecialtyTypesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SpecialtyTypesModule { }
