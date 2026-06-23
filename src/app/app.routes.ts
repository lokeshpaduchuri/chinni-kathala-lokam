import { Routes } from '@angular/router';
import { LibraryHomeComponent } from './components/library-home.component';
import { BookLandingComponent } from './components/book-landing.component';
import { PrintBookComponent } from './components/print-book.component';
import { MobileReaderComponent } from './components/mobile-reader.component';

export const routes: Routes = [
  { path: '', component: LibraryHomeComponent, title: 'చిన్ని కథల లోకం' },
  { path: 'book/:bookId', component: BookLandingComponent },
  { path: 'book/:bookId/read/:chapterNumber', component: MobileReaderComponent },
  { path: 'book/:bookId/read', redirectTo: 'book/:bookId/read/1' },
  { path: 'book/:bookId/chapter/:chapterNumber', redirectTo: 'book/:bookId/read/:chapterNumber' },
  { path: 'book/:bookId/print', component: PrintBookComponent },
  { path: '**', redirectTo: '' }
];
