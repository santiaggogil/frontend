import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OperatorSpecialties } from 'src/app/models/operator-specialties.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Operator_specialtyService {

  constructor(private http: HttpClient) { }
  list(): Observable<OperatorSpecialties[]> {
    return this.http.get<OperatorSpecialties[]>(`${environment.url_ms_business}/operatorSpecialties`);
  }
  view(id: number):Observable<OperatorSpecialties> {
    return this.http.get<OperatorSpecialties>(`${environment.url_ms_business}/operatorSpecialties/${id}`);
  }
  create(newOperator_specialties: OperatorSpecialties):Observable<OperatorSpecialties> {
    return this.http.post<OperatorSpecialties>(`${environment.url_ms_business}/operatorSpecialties`,newOperator_specialties);
  }
  update(theOperator_specialties: OperatorSpecialties):Observable<OperatorSpecialties> {
  return this.http.put<OperatorSpecialties>(`${environment.url_ms_business}/operatorSpecialties/${theOperator_specialties.id}`,theOperator_specialties);
  }
  delete(id: number) {
    return this.http.delete<OperatorSpecialties>(`${environment.url_ms_business}/operatorSpecialties/${id}`);
  }
}
