import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Insurance } from 'src/app/models/insurance.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {

  constructor(private http: HttpClient) { }
  list(): Observable<Insurance[]> {
    return this.http.get<Insurance[]>(`${environment.url_ms_business}/insurances`);
  }
  view(id: number):Observable<Insurance> {
    return this.http.get<Insurance>(`${environment.url_ms_business}/insurances/${id}`);
  }
  create(newInsurance: Insurance):Observable<Insurance> {
    return this.http.post<Insurance>(`${environment.url_ms_business}/insurances`,newInsurance);
  }
  update(theInsurance:Insurance):Observable<Insurance> {
  return this.http.put<Insurance>(`${environment.url_ms_business}/insurances/${theInsurance.id}`,theInsurance);
  }
  delete(id: number) {
    return this.http.delete<Insurance>(`${environment.url_ms_business}/insurances/${id}`);
  }
}
