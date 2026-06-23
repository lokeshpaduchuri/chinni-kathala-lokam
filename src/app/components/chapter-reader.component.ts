import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, switchMap } from 'rxjs';
import { StorybookDataService } from '../services/storybook-data.service';
import { ChapterPageComponent } from './chapter-page.component';
import { ChapterNavigationComponent } from './chapter-navigation.component';
@Component({ selector: 'app-chapter-reader', standalone: true, imports: [AsyncPipe, ChapterPageComponent, ChapterNavigationComponent], template: `
  @if (vm$ | async; as vm) { @if (vm.book && vm.chapter) { <section class="single-reader"><app-chapter-page [chapter]="vm.chapter" /><app-chapter-navigation [bookId]="vm.book.id" [chapterNumber]="vm.chapter.chapterNumber" [total]="vm.book.chapters.length" /></section> } }
` })
export class ChapterReaderComponent { private route = inject(ActivatedRoute); private data = inject(StorybookDataService); readonly vm$ = combineLatest([this.route.paramMap, this.route.paramMap]).pipe(map(([p]) => ({ id: p.get('bookId') ?? '', n: Number(p.get('chapterNumber')) })), switchMap(x => this.data.getBook(x.id).pipe(map(book => ({ book, chapter: book?.chapters.find(c => c.chapterNumber === x.n) ?? null })) ))); }
