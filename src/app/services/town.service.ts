import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Town } from 'src/app/models/town.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TownService {

  constructor(private http: HttpClient) { }
  list(): Observable<Town[]> {
    return this.http.get<Town[]>(`${environment.url_ms_business}/towns`);
  }
  view(id: number):Observable<Town> {
    return this.http.get<Town>(`${environment.url_ms_business}/towns/${id}`);
  }
  create(newTown: Town):Observable<Town> {
    return this.http.post<Town>(`${environment.url_ms_business}/towns`,newTown);
  }
  update(theTown: Town):Observable<Town> {
  return this.http.put<Town>(`${environment.url_ms_business}/towns/${theTown.id}`,theTown);
  }
  delete(id: number) {
    return this.http.delete<Town>(`${environment.url_ms_business}/towns/${id}`);
  }
}
