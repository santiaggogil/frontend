import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Operator } from 'src/app/models/operator.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

  constructor(private http: HttpClient) { }
  list(): Observable<Operator[]> {
    return this.http.get<Operator[]>(`${environment.url_ms_business}/operators`);
  }
  view(id: number):Observable<Operator> {
    return this.http.get<Operator>(`${environment.url_ms_business}/operators/${id}`);
  }
  create(newOperator: Operator):Observable<Operator> {
    return this.http.post<Operator>(`${environment.url_ms_business}/operators`,newOperator);
  }
  update(theOperator: Operator):Observable<Operator> {
  return this.http.put<Operator>(`${environment.url_ms_business}/operators/${theOperator.id}`,theOperator);
  }
  delete(id: number) {
    return this.http.delete<Operator>(`${environment.url_ms_business}/operators/${id}`);
  }
}
