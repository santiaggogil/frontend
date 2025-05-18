import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceType } from '../models/service-type.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {
constructor(private http: HttpClient) { }
  list(): Observable<ServiceType[]> {
    return this.http.get<ServiceType[]>(`${environment.url_ms_business}/serviceTypes`);
  }
  view(id: number):Observable<ServiceType> {
    return this.http.get<ServiceType>(`${environment.url_ms_business}/serviceTypes/${id}`);
  }
  create(newServiceType: ServiceType):Observable<ServiceType> {
    return this.http.post<ServiceType>(`${environment.url_ms_business}/serviceTypes`,newServiceType);
  }
  update(theServiceType: ServiceType):Observable<ServiceType> {
  return this.http.put<ServiceType>(`${environment.url_ms_business}/serviceTypes/${theServiceType.id}`,theServiceType);
  }
  delete(id: number) {
    return this.http.delete<ServiceType>(`${environment.url_ms_business}/serviceTypes/${id}`);
  }
}
