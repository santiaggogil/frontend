import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Procedure } from '../models/procedure.model';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {
  constructor(private http: HttpClient) { }
      list(): Observable<Procedure[]> {
        return this.http.get<Procedure[]>(`${environment.url_ms_business}/procedures`);
      }
      view(id: number):Observable<Procedure> {
        return this.http.get<Procedure>(`${environment.url_ms_business}/procedures/${id}`);
      }
      create(newProcedures: Procedure):Observable<Procedure> {
        return this.http.post<Procedure>(`${environment.url_ms_business}/procedures`,newProcedures);
      }
      update(theProcedures:Procedure):Observable<Procedure> {
      return this.http.put<Procedure>(`${environment.url_ms_business}/procedures/${theProcedures.id}`,theProcedures);
      }
      delete(id: number) {
        return this.http.delete<Procedure>(`${environment.url_ms_business}/procedures/${id}`);
      }
}
