import { Injectable } from '@angular/core';
import { Machine } from '../models/machine.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  constructor(private http: HttpClient) { }
    list(): Observable<Machine[]> {
      return this.http.get<Machine[]>(`${environment.url_ms_business}/machines`);
    }
    view(id: number):Observable<Machine> {
      return this.http.get<Machine>(`${environment.url_ms_business}/machines/${id}`);
    }
    create(newMachines: Machine):Observable<Machine> {
      return this.http.post<Machine>(`${environment.url_ms_business}/machines`,newMachines);
    }
    update(theMachines:Machine):Observable<Machine> {
    return this.http.put<Machine>(`${environment.url_ms_business}/machines/${theMachines.id}`,theMachines);
    }
    delete(id: number) {
      return this.http.delete<Machine>(`${environment.url_ms_business}/machines/${id}`);
    }
}
