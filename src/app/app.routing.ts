import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginSuccessComponent } from './pages/login-success/login-success.component';
import { NoAuthenticatedGuard } from './guards/no-authenticated.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Por defecto, redirige al login.
    pathMatch: 'full',
  },
  {
    path: 'login-success',
    component: LoginSuccessComponent
  },
  {
    path: '', // Las rutas bajo este path NO llevan un prefijo. Ej: /dashboard, /tables
    component: AdminLayoutComponent,
    children: [
      {
        // Carga perezosamente todas las rutas definidas en AdminLayoutModule
        path: '',
        canActivate: [AuthenticatedGuard], 
        loadChildren: () => import('src/app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  },
  {
    path: '', // Las rutas bajo este path TAMPOCO llevan un prefijo. Ej: /login, /register
    component: AuthLayoutComponent,
    children: [
      {
        // Carga perezosamente todas las rutas definidas en AuthLayoutModule
        path: '',
        loadChildren: () => import('src/app/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  },
  {
    // ¡ESTA ES LA RUTA QUE FALTABA!
    // Esto es para que las rutas de tus páginas de login, register, etc. sean encontradas.
    // Asumimos que LoginPageModule está dentro de AuthLayoutModule.
    // Si no es así, esta es una forma de declararlo explícitamente.
    // Sin embargo, lo más limpio es que estas rutas estén dentro de AuthLayoutModule.
    // Por ahora, vamos a confiar en que la estructura de Argon lo maneja bien.
    // Si el error persiste, deberíamos revisar `auth-layout.routing.ts`.
    path: '',
    loadChildren: () => import('src/app/pages/login-page/login-page.module').then(m => m.LoginPageModule)
  },
  {
    // Ruta "catch-all" para redirigir al dashboard si se escribe una URL que no existe.
    // Debe ir al final.
    path: '**',
    redirectTo: 'dashboard'
  }
];

// ...existing imports...



// Nota: He eliminado las rutas específicas como 'states', 'specialties', etc., del archivo principal.
// Estas rutas DEBEN estar definidas DENTRO del `admin-layout.routing.ts`
// o del módulo correspondiente que se carga perezosamente.
// Tenerlas aquí crea rutas como /states/states, lo cual es incorrecto.

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
    RouterModule // <-- ¡MUY IMPORTANTE! Faltaba exportar RouterModule
  ],
})
export class AppRoutingModule { }