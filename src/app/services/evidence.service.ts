import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evidence } from 'src/app/models/evidence.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {

  constructor(private http: HttpClient) { }
  list(): Observable<Evidence[]> {
    return this.http.get<Evidence[]>(`${environment.url_ms_business}/evidences`);
  }
  view(id: number):Observable<Evidence> {
    return this.http.get<Evidence>(`${environment.url_ms_business}/evidences/${id}`);
  }
  create(newEvidence: Evidence):Observable<Evidence> {
    return this.http.post<Evidence>(`${environment.url_ms_business}/evidences`,newEvidence);
  }
  update(theEvidence: Evidence):Observable<Evidence> {
  return this.http.put<Evidence>(`${environment.url_ms_business}/evidences/${theEvidence.id}`,theEvidence);
  }
  delete(id: number) {
    return this.http.delete<Evidence>(`${environment.url_ms_business}/evidences/${id}`);
  }
}
