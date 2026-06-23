import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LibraryBook } from '../models/storybook.models';
import { BookCoverComponent } from './book-cover.component';
import { getTonightChapter } from '../utils/tonights-story';

@Component({ selector: 'app-book-card', standalone: true, imports: [RouterLink, BookCoverComponent], template: `
  <article class="book-card" [class.coming-soon]="!book.available">
    <app-book-cover [book]="book" [compact]="true" />
    <div class="book-card-copy"><span class="eyebrow">{{ book.category }} · {{ book.ageRange }}</span><h3>{{ book.titleTelugu }}</h3><h4>{{ book.titleEnglish }}</h4><p>{{ book.description }}</p>
      @if (book.available) { <div class="book-card-actions"><a class="text-link desktop-book-link" [routerLink]="['/book', book.id]">పుస్తకం తెరవండి <span>→</span></a><a class="reader-cta mobile-book-link" [routerLink]="['/book', book.id, 'read', 1]">చదవండి · Read <span>→</span></a><a class="tonight-link" [routerLink]="['/book', book.id, 'read', tonightChapter]"><span>☾</span><b>ఈ రోజు కథ</b><small>Tonight’s Story</small></a></div> } @else { <span class="soon-pill">త్వరలో · Coming soon</span> }
    </div>
  </article>
` })
export class BookCardComponent { @Input({ required: true }) book!: LibraryBook; get tonightChapter(): number { return getTonightChapter(this.book.chapterCount); } }
