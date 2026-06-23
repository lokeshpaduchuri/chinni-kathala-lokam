import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { StorybookDataService } from '../services/storybook-data.service';
import { ChapterPageComponent } from './chapter-page.component';
import { ClosingBlessingComponent } from './closing-blessing.component';
@Component({ selector: 'app-reading-mode', standalone: true, imports: [AsyncPipe, RouterLink, ChapterPageComponent, ClosingBlessingComponent], template: `
  @if (book$ | async; as book) { <div class="reader-toolbar no-print"><a [routerLink]="['/book', book.id]">← పుస్తకం వివరాలు</a><span>{{ book.titleTelugu }}</span><a [routerLink]="['/book', book.id, 'print']">⎙ Print</a></div><section class="reading-stack">@for (chapter of book.chapters; track chapter.chapterNumber) { <app-chapter-page [chapter]="chapter" /> }<app-closing-blessing [text]="book.closingBlessing" /></section> }
` })
export class ReadingModeComponent { private route = inject(ActivatedRoute); private data = inject(StorybookDataService); readonly book$ = this.route.paramMap.pipe(map(p => p.get('bookId') ?? ''), switchMap(id => this.data.getBook(id))); }
