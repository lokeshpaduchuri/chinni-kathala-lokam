import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { StorybookDataService } from '../services/storybook-data.service';
import { BookCoverComponent } from './book-cover.component';
import { BookIntroductionComponent } from './book-introduction.component';
import { getTonightChapter } from '../utils/tonights-story';

@Component({ selector: 'app-book-landing', standalone: true, imports: [AsyncPipe, RouterLink, BookCoverComponent, BookIntroductionComponent], template: `
  @if (vm$ | async; as vm) { @if (vm.book && vm.meta) {
    <section class="book-hero"><app-book-cover [book]="vm.meta" /><div class="book-details"><span class="eyebrow">{{ vm.meta.category }} · {{ vm.meta.ageRange }}</span><h1>{{ vm.book.titleTelugu }}</h1><h2>{{ vm.book.titleEnglish }}</h2><p class="subtitle">{{ vm.book.subtitle }}</p><p>{{ vm.meta.description }}</p><div class="action-row"><a class="primary-button" [routerLink]="['/book', vm.book.id, 'read', 1]">చదవడం ప్రారంభించండి <span>→</span></a><a class="tonight-button" [routerLink]="['/book', vm.book.id, 'read', tonightChapter(vm.book.chapters.length)]"><span>☾</span><b>ఈ రోజు కథ</b><small>Tonight’s Story</small></a><a class="secondary-button" [routerLink]="['/book', vm.book.id, 'print']">⎙ Print / PDF</a></div></div></section>
    <app-book-introduction [book]="vm.book" />
    <section class="contents-section"><header class="section-heading"><p class="overline">CONTENTS</p><h2>విషయ సూచిక</h2></header><div class="chapter-list">@for (chapter of vm.book.chapters; track chapter.chapterNumber) { <a [routerLink]="['/book', vm.book.id, 'read', chapter.chapterNumber]"><span class="chapter-number">{{ chapter.chapterNumber.toString().padStart(2, '0') }}</span><span><b>{{ chapter.chapterTitleTelugu }}</b><small>{{ chapter.chapterTitle }}</small></span><i>→</i></a> }</div></section>
  } @else { <div class="not-found"><h1>పుస్తకం కనబడలేదు</h1><a routerLink="/">గ్రంథాలయానికి తిరిగి వెళ్ళండి</a></div> } }
` })
export class BookLandingComponent {
  private readonly route = inject(ActivatedRoute); private readonly data = inject(StorybookDataService);
  readonly vm$ = this.route.paramMap.pipe(map(p => p.get('bookId') ?? ''), switchMap(id => this.data.getBook(id).pipe(switchMap(book => this.data.getLibrary().pipe(map(lib => ({ book, meta: lib.books.find(b => b.id === id) ?? null })))))));
  tonightChapter(chapterCount: number): number { return getTonightChapter(chapterCount); }
}
