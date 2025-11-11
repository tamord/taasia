import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Article {
  id: number;
  title: string;
  text: string;
}

export interface ArticleRequest {
  title: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:5020/api/Article';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  createArticle(article: ArticleRequest): Observable<Article> {
    console.log('Sending POST request to:', `${this.apiUrl}/articles`);
    console.log('Request body:', JSON.stringify(article));
    return this.http.post<Article>(`${this.apiUrl}/articles`, article, this.httpOptions);
  }

  updateArticle(id: number, article: ArticleRequest): Observable<Article> {
    console.log('Sending PUT request to:', `${this.apiUrl}/articles/${id}`);
    console.log('Request body:', JSON.stringify(article));
    return this.http.put<Article>(`${this.apiUrl}/articles/${id}`, article, this.httpOptions);
  }

  deleteArticle(id: number): Observable<void> {
    console.log('Sending DELETE request to:', `${this.apiUrl}/articles/${id}`);
    return this.http.delete<void>(`${this.apiUrl}/articles/${id}`, this.httpOptions);
  }
}

