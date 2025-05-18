import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }
  list(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.url_ms_business}/projects`);
  }
  view(id: number):Observable<Project> {
    return this.http.get<Project>(`${environment.url_ms_business}/projects/${id}`);
  }
  create(newProject: Project):Observable<Project> {
    return this.http.post<Project>(`${environment.url_ms_business}/projects`,newProject);
  }
  update(theProject: Project):Observable<Project> {
  return this.http.put<Project>(`${environment.url_ms_business}/projects/${theProject.id}`,theProject);
  }
  delete(id: number) {
    return this.http.delete<Project>(`${environment.url_ms_business}/projects/${id}`);
  }
}
