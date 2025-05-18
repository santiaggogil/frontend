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
