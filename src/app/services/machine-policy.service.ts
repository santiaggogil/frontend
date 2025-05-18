import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MachinePolicy } from '../models/machine-policy.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MachinePolicyService {
constructor(private http: HttpClient) { }
  list(): Observable<MachinePolicy[]> {
    return this.http.get<MachinePolicy[]>(`${environment.url_ms_business}/machinePolicies`);
  }
  view(id: number):Observable<MachinePolicy> {
    return this.http.get<MachinePolicy>(`${environment.url_ms_business}/machinePolicies/${id}`);
  }
  create(newMachinePolicy: MachinePolicy):Observable<MachinePolicy> {
    return this.http.post<MachinePolicy>(`${environment.url_ms_business}/machinePolicies`,newMachinePolicy);
  }
  update(theMachinePolicy:MachinePolicy):Observable<MachinePolicy> {
  return this.http.put<MachinePolicy>(`${environment.url_ms_business}/machinePolicies/${theMachinePolicy.id}`,theMachinePolicy);
  }
  delete(id: number) {
    return this.http.delete<MachinePolicy>(`${environment.url_ms_business}/machinePolicies/${id}`);
  }
}
