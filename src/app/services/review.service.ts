import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from 'src/app/models/review.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }
  list(): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.url_ms_business}/reviews`);
  }
  view(id: number):Observable<Review> {
    return this.http.get<Review>(`${environment.url_ms_business}/reviews/${id}`);
  }
  create(newReview: Review):Observable<Review> {
    return this.http.post<Review>(`${environment.url_ms_business}/reviews`,newReview);
  }
  update(theReview: Review):Observable<Review> {
  return this.http.put<Review>(`${environment.url_ms_business}/reviews/${theReview.id}`,theReview);
  }
  delete(id: number) {
    return this.http.delete<Review>(`${environment.url_ms_business}/reviews/${id}`);
  }
}
