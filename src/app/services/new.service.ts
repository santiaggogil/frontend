import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { New } from '../models/new.model';

@Injectable({
  providedIn: 'root'
})
export class NewService {
  constructor(private http: HttpClient) { }
      list(): Observable<New[]> {
        return this.http.get<New[]>(`${environment.url_ms_business}/news`);
      }
      view(id: number):Observable<New> {
        return this.http.get<New>(`${environment.url_ms_business}/news/${id}`);
      }
      create(newNews: New):Observable<New> {
        return this.http.post<New>(`${environment.url_ms_business}/news`,newNews);
      }
      update(theNews:New):Observable<New> {
      return this.http.put<New>(`${environment.url_ms_business}/news/${theNews.id}`,theNews);
      }
      delete(id: number) {
        return this.http.delete<New>(`${environment.url_ms_business}/news/${id}`);
      }
}
