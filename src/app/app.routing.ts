import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  },{
    path: 'states',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/states/states.module').then(m => m.StatesModule)
      }
    ]
  },{
    path: 'specialties',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/specialties/specialties.module').then(m => m.SpecialtiesModule)
      }
    ]
  },{
    path: 'operators',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/operators/operators.module').then(m => m.OperatorsModule)
      }
    ]
  },
  {
    path: 'operatorSpecialties',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/operator_specialties/operator-specialties.module').then(m => m.OperatorSpecialtiesModule)
      }
    ]
  },
  {
    path: 'insurances',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/insurances/insurances.module').then(m => m.insurancesModule)
      }
    ]
  },
  {
    path: 'operatorPolicies',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/operator-policies/operator-policies.module').then(m => m.OperatorPoliciesModule)
      }
    ]
  },
  {
    path: 'machines',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/machines/machines.module').then(m => m.MachinesModule)
      }
    ]
  },
  {
    path: 'machinePolicies',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/machine-policies/machine-policies.module').then(m => m.MachinePoliciesModule)
      }
    ]
  },
  {
    path: 'serviceTypes',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/service-types/service-types.module').then(m => m.ServiceTypesModule)
      }
    ]
  },
  {
    path: 'specialtyTypes',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/specialty-types/specialty-types.module').then(m => m.SpecialtyTypesModule)
      }
    ]
  },
  {
    path: 'shifts',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/shifts/shifts.module').then(m => m.ShiftsModule)
      }
    ]
  },
  {
    path: 'news',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/news/news.module').then(m => m.NewsModule)
      }
    ]
  },
  {
    path: 'maintenances',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/maintenances/maintenances.module').then(m => m.MaintenancesModule)
      }
    ]
  },
  {
    path: 'procedures',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/procedures/procedures.module').then(m => m.ProceduresModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
