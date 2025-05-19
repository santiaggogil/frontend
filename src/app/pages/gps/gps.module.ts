import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GpsRoutingModule } from './gps-routing.module';
import { GpsListComponent } from './list/list.component';
import { ManageGpsComponent } from './manage/manage.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GpsListComponent,
    ManageGpsComponent
  ],
  imports: [
    CommonModule,
    GpsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GpsModule { }
