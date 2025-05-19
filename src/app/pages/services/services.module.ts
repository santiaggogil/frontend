// services.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // <--- 1. IMPORTA ESTO

import { ServicesRoutingModule } from './services-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';


@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    ReactiveFormsModule // <--- 2. AÑADE ESTO AQUÍ
  ]
})
export class ServicesModule { }