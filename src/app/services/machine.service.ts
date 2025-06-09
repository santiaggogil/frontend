// EN: machine.service.ts

import { Injectable } from '@angular/core';
import { Machine } from '../models/machine.model';
import { Observable } from 'rxjs';
// HttpHeaders nos permite crear las cabeceras para la petición
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// Importamos el servicio de seguridad para poder acceder al token
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  // 1. Inyectamos SecurityService en el constructor
  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) { }

  /**
   * 2. Creamos un método privado para no repetir código.
   *    Este método crea las cabeceras de autorización.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.securityService.getToken();
    // El formato estándar es 'Bearer <token>'
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // 3. Modificamos CADA método para que use las cabeceras
  list(): Observable<Machine[]> {
    return this.http.get<Machine[]>(`${environment.url_ms_business}/machines`, {
      headers: this.getAuthHeaders()  
    });
  }

  view(id: number):Observable<Machine> {
    return this.http.get<Machine>(`${environment.url_ms_business}/machines/${id}`, {
      headers: this.getAuthHeaders()  
    });
  }

  create(newMachines: Machine):Observable<Machine> {
    return this.http.post<Machine>(`${environment.url_ms_business}/machines`, newMachines, {
      headers: this.getAuthHeaders()  
    });
  }

  update(theMachines:Machine):Observable<Machine> {
    return this.http.put<Machine>(`${environment.url_ms_business}/machines/${theMachines.id}`, theMachines, {
      headers: this.getAuthHeaders()  
    });
  }

  delete(id: number) {
    return this.http.delete<Machine>(`${environment.url_ms_business}/machines/${id}`, {
      headers: this.getAuthHeaders() 
    });
  }
}