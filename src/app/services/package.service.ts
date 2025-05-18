import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Package } from 'src/app/models/package.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private http: HttpClient) { }
  list(): Observable<Package[]> {
    return this.http.get<Package[]>(`${environment.url_ms_business}/packages`);
  }
  view(id: number):Observable<Package> {
    return this.http.get<Package>(`${environment.url_ms_business}/packages/${id}`);
  }
  create(newPackage: Package):Observable<Package> {
    return this.http.post<Package>(`${environment.url_ms_business}/packages`,newPackage);
  }
  update(thePackage: Package):Observable<Package> {
  return this.http.put<Package>(`${environment.url_ms_business}/packages/${thePackage.id}`,thePackage);
  }
  delete(id: number) {
    return this.http.delete<Package>(`${environment.url_ms_business}/packages/${id}`);
  }
}
