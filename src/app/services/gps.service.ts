import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gps } from '../models/gps.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  constructor(private http: HttpClient) { }
      list(): Observable<Gps[]> {
        return this.http.get<Gps[]>(`${environment.url_ms_business}/gps`);
      }
      view(id: number):Observable<Gps> {
        return this.http.get<Gps>(`${environment.url_ms_business}/gps/${id}`);
      }
      create(newGpss: Gps):Observable<Gps> {
        return this.http.post<Gps>(`${environment.url_ms_business}/gps`,newGpss);
      }
      update(theGps:Gps):Observable<Gps> {
      return this.http.put<Gps>(`${environment.url_ms_business}/gps/${theGps.id}`,theGps);
      }
      delete(id: number) {
        return this.http.delete<Gps>(`${environment.url_ms_business}/gps/${id}`);
      }
}
