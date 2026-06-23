import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { StorybookDataService } from '../services/storybook-data.service';
import { ChapterPageComponent } from './chapter-page.component';
import { ClosingBlessingComponent } from './closing-blessing.component';
@Component({ selector: 'app-print-book', standalone: true, imports: [AsyncPipe, RouterLink, ChapterPageComponent, ClosingBlessingComponent], template: `
  @if (book$ | async; as book) { <div class="print-toolbar no-print"><a [routerLink]="['/book', book.id]">← Back to book</a><span>Print preview · 8.5 × 11 in</span><button (click)="print()">⎙ Print / Save as PDF</button></div><article class="print-book"><section class="print-title"><div class="peacock">🦚</div><h1>{{ book.titleTelugu }}</h1><h2>{{ book.titleEnglish }}</h2><p>{{ book.subtitle }}</p></section><section class="print-intro"><h2>ముందుమాట</h2><p>{{ book.introduction }}</p></section>@for (chapter of book.chapters; track chapter.chapterNumber) { <app-chapter-page [chapter]="chapter" /> }<app-closing-blessing [text]="book.closingBlessing" /></article> }
` })
export class PrintBookComponent { private route = inject(ActivatedRoute); private data = inject(StorybookDataService); readonly book$ = this.route.paramMap.pipe(map(p => p.get('bookId') ?? ''), switchMap(id => this.data.getBook(id))); print(): void { window.print(); } }
