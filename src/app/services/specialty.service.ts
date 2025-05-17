import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Specialty } from 'src/app/models/specialty.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {

  constructor(private http: HttpClient) { }
  list(): Observable<Specialty[]> {
    return this.http.get<Specialty[]>(`${environment.url_ms_business}/specialties`);
  }
  view(id: number):Observable<Specialty> {
    return this.http.get<Specialty>(`${environment.url_ms_business}/specialties/${id}`);
  }
  create(newSpecialty: Specialty):Observable<Specialty> {
    return this.http.post<Specialty>(`${environment.url_ms_business}/specialties`,newSpecialty);
  }
  update(theSpecialty: Specialty):Observable<Specialty> {
  return this.http.put<Specialty>(`${environment.url_ms_business}/specialties/${theSpecialty.id}`,theSpecialty);
  }
  delete(id: number) {
    return this.http.delete<Specialty>(`${environment.url_ms_business}/specialties/${id}`);
  }
}
