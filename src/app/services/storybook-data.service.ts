import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, shareReplay } from 'rxjs';
import { Book, Library } from '../models/storybook.models';

@Injectable({ providedIn: 'root' })
export class StorybookDataService {
  private readonly library$ = this.http.get<Library>('assets/data/library.json').pipe(shareReplay(1));
  constructor(private readonly http: HttpClient) {}
  getLibrary(): Observable<Library> { return this.library$; }
  getBook(bookId: string): Observable<Book | null> {
    return this.http.get<Book>(`assets/data/books/${bookId}.json`).pipe(catchError(() => of(null)));
  }
}
