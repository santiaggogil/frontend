import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from 'src/app/models/state.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private http: HttpClient) { }
  list(): Observable<State[]> {
    return this.http.get<State[]>(`${environment.url_ms_business}/states`);
  }
  view(id: number):Observable<State> {
    return this.http.get<State>(`${environment.url_ms_business}/states/${id}`);
  }
  create(newState: State):Observable<State> {
    return this.http.post<State>(`${environment.url_ms_business}/states`,newState);
  }
  update(theState: State):Observable<State> {
  return this.http.put<State>(`${environment.url_ms_business}/states/${theState.id}`,theState);
  }
  delete(id: number) {
    return this.http.delete<State>(`${environment.url_ms_business}/states/${id}`);
  }
}
