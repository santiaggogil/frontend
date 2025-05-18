import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OperatorPoliciesRoutingModule } from './operator-policies-routing.module';
import { OperatorPolicyListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';


@NgModule({
  declarations: [
    OperatorPolicyListComponent,
    ManageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OperatorPoliciesRoutingModule
  ]
})
export class OperatorPoliciesModule { }
