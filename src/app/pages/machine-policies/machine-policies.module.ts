import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MachinePoliciesRoutingModule } from './machine-policies-routing.module';
import { MachinePolicyListComponent } from './list/list.component';
import { ManageMachinePolicyComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MachinePolicyListComponent,
    ManageMachinePolicyComponent
  ],
  imports: [
    CommonModule,
    MachinePoliciesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MachinePoliciesModule { }
