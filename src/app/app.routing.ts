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
  },{
    path: 'services',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/services/services.module').then(m => m.ServicesModule)
      }
    ]
  },{
    path: 'packages',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/packages/packages.module').then(m => m.PackagesModule)
      }
    ]
  },{
    path: 'reviews',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/reviews/reviews.module').then(m => m.ReviewsModule)
      }
    ]
  },{
    path: 'evidences',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/evidences/evidences.module').then(m => m.EvidencesModule)
      }
    ]
  },{
    path: 'bills',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/bills/bills.module').then(m => m.BillsModule)
      }
    ]
  },{
    path: 'quotas',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/quotas/quotas.module').then(m => m.QuotasModule)
      }
    ]
  },{
    path: 'towns',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/towns/towns.module').then(m => m.TownsModule)
      }
    ]
  },{
    path: 'projects',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/projects/projects.module').then(m => m.ProjectsModule)
      }
    ]
  },{
    path: 'project-town',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/project-town/project-town.module').then(m => m.ProjectTownModule)
      }
    ]
  },{
    path: 'governors',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/governors/governors.module').then(m => m.GovernorsModule)
      }
    ]
  },{
    path: 'mayors',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/mayors/mayors.module').then(m => m.MayorsModule)
      }
    ]
  },{
    path: 'mayor-town',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/mayor-town/mayor-town.module').then(m => m.MayorTownModule)
      }
    ]
  },{
    path: 'chats',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/chats/chats.module').then(m => m.ChatsModule)
      }
    ]
  },{
    path: 'messages',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/messages/messages.module').then(m => m.MessagesModule)
      }
    ]
  },{
    path: 'state-governor',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/state-governor/state-governor.module').then(m => m.StateGovernorModule)
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
