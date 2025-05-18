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
