import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectTown } from 'src/app/models/project-town.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectTownService {

  constructor(private http: HttpClient) { }
  list(): Observable<ProjectTown[]> {
    return this.http.get<ProjectTown[]>(`${environment.url_ms_business}/projectTowns`);
  }
  view(id: number):Observable<ProjectTown> {
    return this.http.get<ProjectTown>(`${environment.url_ms_business}/projectTowns/${id}`);
  }
  create(newProjectTown: ProjectTown):Observable<ProjectTown> {
    return this.http.post<ProjectTown>(`${environment.url_ms_business}/projectTowns`,newProjectTown);
  }
  update(theProjectTown: ProjectTown):Observable<ProjectTown> {
  return this.http.put<ProjectTown>(`${environment.url_ms_business}/projectTowns/${theProjectTown.id}`,theProjectTown);
  }
  delete(id: number) {
    return this.http.delete<ProjectTown>(`${environment.url_ms_business}/projectTowns/${id}`);
  }
}
