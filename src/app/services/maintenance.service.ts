import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Maintenance } from '../models/maintenance.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  constructor(private http: HttpClient) { }
        list(): Observable<Maintenance[]> {
          return this.http.get<Maintenance[]>(`${environment.url_ms_business}/maintenances`);
        }
        view(id: number):Observable<Maintenance> {
          return this.http.get<Maintenance>(`${environment.url_ms_business}/maintenances/${id}`);
        }
        create(MaintenanceMaintenances: Maintenance):Observable<Maintenance> {
          return this.http.post<Maintenance>(`${environment.url_ms_business}/maintenances`,MaintenanceMaintenances);
        }
        update(theMaintenances:Maintenance):Observable<Maintenance> {
        return this.http.put<Maintenance>(`${environment.url_ms_business}/maintenances/${theMaintenances.id}`,theMaintenances);
        }
        delete(id: number) {
          return this.http.delete<Maintenance>(`${environment.url_ms_business}/maintenances/${id}`);
        }
}
