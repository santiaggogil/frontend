import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SpecialtyType } from '../models/specialty-type.model';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyTypeService {
  constructor(private http: HttpClient) { }
    list(): Observable<SpecialtyType[]> {
      return this.http.get<SpecialtyType[]>(`${environment.url_ms_business}/specialtyTypes`);
    }
    view(id: number):Observable<SpecialtyType> {
      return this.http.get<SpecialtyType>(`${environment.url_ms_business}/specialtyTypes/${id}`);
    }
    create(newSpecialtyType: SpecialtyType):Observable<SpecialtyType> {
      return this.http.post<SpecialtyType>(`${environment.url_ms_business}/specialtyTypes`,newSpecialtyType);
    }
    update(theSpecialtyType: SpecialtyType):Observable<SpecialtyType> {
    return this.http.put<SpecialtyType>(`${environment.url_ms_business}/specialtyTypes/${theSpecialtyType.id}`,theSpecialtyType);
    }
    delete(id: number) {
      return this.http.delete<SpecialtyType>(`${environment.url_ms_business}/specialtyTypes/${id}`);
    }
}
