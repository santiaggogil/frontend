import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // <-- IMPORTANTE: Para el ruteo

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // <-- IMPORTANTE: Para [ngbCollapse] y otros

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module'; // <-- IMPORTANTE: Para app-sidebar, etc.

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,   // <-- AÑADIDO: Provee app-sidebar, app-navbar, app-footer
    NgbModule,          // <-- AÑADIDO: Provee [ngbCollapse]
    RouterModule,       // <-- AÑADIDO: Provee <router-outlet> y [routerLink]
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }