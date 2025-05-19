import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mayor } from 'src/app/models/mayor.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MayorService {

  constructor(private http: HttpClient) { }
  list(): Observable<Mayor[]> {
    return this.http.get<Mayor[]>(`${environment.url_ms_business}/mayors`);
  }
  view(id: number):Observable<Mayor> {
    return this.http.get<Mayor>(`${environment.url_ms_business}/mayors/${id}`);
  }
  create(newMayor: Mayor):Observable<Mayor> {
    return this.http.post<Mayor>(`${environment.url_ms_business}/mayors`,newMayor);
  }
  update(theMayor: Mayor):Observable<Mayor> {
  return this.http.put<Mayor>(`${environment.url_ms_business}/mayors/${theMayor.id}`,theMayor);
  }
  delete(id: number) {
    return this.http.delete<Mayor>(`${environment.url_ms_business}/mayors/${id}`);
  }
}
