import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StateGovernor } from 'src/app/models/state-governor.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StateGovernorService {

  constructor(private http: HttpClient) { }
  list(): Observable<StateGovernor[]> {
    return this.http.get<StateGovernor[]>(`${environment.url_ms_business}/stateGovernors`);
  }
  view(id: number):Observable<StateGovernor> {
    return this.http.get<StateGovernor>(`${environment.url_ms_business}/stateGovernors/${id}`);
  }
  create(newStateGovernor: StateGovernor):Observable<StateGovernor> {
    return this.http.post<StateGovernor>(`${environment.url_ms_business}/stateGovernors`,newStateGovernor);
  }
  update(theStateGovernor: StateGovernor):Observable<StateGovernor> {
  return this.http.put<StateGovernor>(`${environment.url_ms_business}/stateGovernors/${theStateGovernor.id}`,theStateGovernor);
  }
  delete(id: number) {
    return this.http.delete<StateGovernor>(`${environment.url_ms_business}/stateGovernors/${id}`);
  }
}