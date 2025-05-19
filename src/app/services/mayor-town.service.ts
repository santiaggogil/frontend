import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MayorTown } from 'src/app/models/mayor-town.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MayorTownService {

  constructor(private http: HttpClient) { }
  list(): Observable<MayorTown[]> {
    return this.http.get<MayorTown[]>(`${environment.url_ms_business}/mayorTowns`);
  }
  view(id: number):Observable<MayorTown> {
    return this.http.get<MayorTown>(`${environment.url_ms_business}/mayorTowns/${id}`);
  }
  create(newMayorTown: MayorTown):Observable<MayorTown> {
    return this.http.post<MayorTown>(`${environment.url_ms_business}/mayorTowns`,newMayorTown);
  }
  update(theMayorTown: MayorTown):Observable<MayorTown> {
  return this.http.put<MayorTown>(`${environment.url_ms_business}/mayorTowns/${theMayorTown.id}`,theMayorTown);
  }
  delete(id: number) {
    return this.http.delete<MayorTown>(`${environment.url_ms_business}/mayorTowns/${id}`);
  }
}
