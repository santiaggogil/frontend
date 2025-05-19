import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Governor } from 'src/app/models/governor.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GovernorService {

  constructor(private http: HttpClient) { }
  list(): Observable<Governor[]> {
    return this.http.get<Governor[]>(`${environment.url_ms_business}/governors`);
  }
  view(id: number):Observable<Governor> {
    return this.http.get<Governor>(`${environment.url_ms_business}/governors/${id}`);
  }
  create(newGovernor: Governor):Observable<Governor> {
    return this.http.post<Governor>(`${environment.url_ms_business}/governors`,newGovernor);
  }
  update(theGovernor: Governor):Observable<Governor> {
  return this.http.put<Governor>(`${environment.url_ms_business}/governors/${theGovernor.id}`,theGovernor);
  }
  delete(id: number) {
    return this.http.delete<Governor>(`${environment.url_ms_business}/governors/${id}`);
  }
}
