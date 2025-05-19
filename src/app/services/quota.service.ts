import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quota } from 'src/app/models/quota.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuotaService {

  constructor(private http: HttpClient) { }
  list(): Observable<Quota[]> {
    return this.http.get<Quota[]>(`${environment.url_ms_business}/quotas`);
  }
  view(id: number):Observable<Quota> {
    return this.http.get<Quota>(`${environment.url_ms_business}/quotas/${id}`);
  }
  create(newQuota: Quota):Observable<Quota> {
    return this.http.post<Quota>(`${environment.url_ms_business}/quotas`,newQuota);
  }
  update(theQuota: Quota):Observable<Quota> {
  return this.http.put<Quota>(`${environment.url_ms_business}/quotas/${theQuota.id}`,theQuota);
  }
  delete(id: number) {
    return this.http.delete<Quota>(`${environment.url_ms_business}/quotas/${id}`);
  }
}
