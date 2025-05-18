import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OperatorPolicy } from '../models/operator-policy.model';

@Injectable({
  providedIn: 'root'
})
export class OperatorPolicyervice {

  constructor(private http: HttpClient) { }
  list(): Observable<OperatorPolicy[]> {
    return this.http.get<OperatorPolicy[]>(`${environment.url_ms_business}/operatorPolicies`);
  }
  view(id: number):Observable<OperatorPolicy> {
    return this.http.get<OperatorPolicy>(`${environment.url_ms_business}/operatorPolicies/${id}`);
  }
  create(newOperatorPolicy: OperatorPolicy):Observable<OperatorPolicy> {
    return this.http.post<OperatorPolicy>(`${environment.url_ms_business}/operatorPolicies`,newOperatorPolicy);
  }
  update(theOperatorPolicy:OperatorPolicy):Observable<OperatorPolicy> {
  return this.http.put<OperatorPolicy>(`${environment.url_ms_business}/operatorPolicies/${theOperatorPolicy.id}`,theOperatorPolicy);
  }
  delete(id: number) {
    return this.http.delete<OperatorPolicy>(`${environment.url_ms_business}/operatorPolicies/${id}`);
  }
}
