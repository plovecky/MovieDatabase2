import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

//interface pro práci s daty od API
export interface ApiResult{
  page: number;
  results: any[];
  total_pages: number;
  total_result: number;
}

//interface pro práci s žánry
export interface ApiGenres{
  genres: any[];
}

@Injectable({
  providedIn: 'root'
})


export class MoviesService {

  constructor(private http: HttpClient) { }
 
  getTopRatedMovied(page = 1): Observable<ApiResult>{
    return this.http.get<ApiResult>(`${environment.baseUrl}/movie/popular?api_key=${environment.apiKey}&page=${page}`);
  }

  getMovieDetails(id: string | null){
    return this.http.get(`${environment.baseUrl}/movie/${id}?api_key=${environment.apiKey}`);
  }

  getSearchedMovies(keyWord: string): Observable<ApiResult>{
    return this.http.get<ApiResult>(`${environment.baseUrl}/search/movie?api_key=${environment.apiKey}&language=en-US&query=${keyWord}&include_adult=false`);
  }

  getMovieGenres(): Observable<ApiGenres>{
    return this.http.get<ApiGenres>(`${environment.baseUrl}/genre/movie/list?api_key=${environment.apiKey}&language=en-US`);

  }

}
