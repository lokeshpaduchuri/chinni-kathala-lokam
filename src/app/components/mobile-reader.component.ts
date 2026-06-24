import { AsyncPipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { Book, Chapter } from '../models/storybook.models';
import { StorybookDataService } from '../services/storybook-data.service';

type ReaderTheme = 'warm' | 'night';
type ReaderFontSize = 'small' | 'medium' | 'large';
type ReaderContentMode = 'meaning' | 'bedtime' | 'both';

@Component({
  selector: 'app-mobile-reader',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  template: `
    @if (vm$ | async; as vm) { @if (vm.book && vm.chapter) {
      <article class="reader-page" [class.reader-theme-night]="theme === 'night'" [class.reader-font-small]="fontSize === 'small'" [class.reader-font-medium]="fontSize === 'medium'" [class.reader-font-large]="fontSize === 'large'" (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event, vm.book, vm.chapter)">
        <header class="mobile-reader-topbar no-print">
          <a routerLink="/" class="topbar-icon-btn topbar-home" aria-label="Back to library">← లోకం</a>
          <a [routerLink]="['/book', vm.book.id]" class="topbar-title" aria-label="Open book details">
            <span class="topbar-book-title">{{ vm.book.titleTelugu }}</span>
            <span class="topbar-progress">అధ్యాయం {{ vm.chapter.chapterNumber }} / {{ vm.book.chapters.length }}</span>
          </a>
          <button type="button" class="topbar-icon-btn" (click)="openChapters()" aria-label="Open chapters">☰</button>
        </header>

        <header class="reader-header">
          <div><span>అధ్యాయం {{ vm.chapter.chapterNumber }}</span><small>CHAPTER {{ vm.chapter.chapterNumber }} OF {{ vm.book.chapters.length }}</small></div>
          <div class="reader-progress" aria-hidden="true"><span [style.width.%]="vm.chapter.chapterNumber / vm.book.chapters.length * 100"></span></div>
          <h1 class="reader-title-telugu">{{ vm.chapter.chapterTitleTelugu }}</h1>
          <p>{{ vm.chapter.chapterTitle }}</p>
        </header>

        <nav class="reader-tools reader-controls" aria-label="Reader preferences">
          <button type="button" (click)="toggleTheme()" [attr.aria-label]="theme === 'night' ? 'Use warm theme' : 'Use night theme'">{{ theme === 'night' ? '☀ Theme' : '☾ Theme' }}</button>
          <button type="button" (click)="cycleFontSize()" [attr.aria-label]="'Change Telugu font size. Current size: ' + fontSize">{{ fontLabel }}</button>
          <button type="button" (click)="cycleContentMode()" aria-label="Change story content mode">{{ modeLabel }}</button>
          <button type="button" (click)="openChapters()">☰ Chapters</button>
        </nav>

        <div class="reader-chapter-layout">
          <div class="reader-copy">
            <section class="reader-verse-card">
              <span class="reader-section-label">తెలుగు పద్యం</span>
              <p class="telugu-verse">{{ vm.chapter.teluguVerse }}</p>
            </section>

            @if (contentMode === 'meaning' || contentMode === 'both') {
              <section class="reader-story"><span class="reader-section-label">అర్థం · MEANING</span><p>{{ vm.chapter.meaning }}</p></section>
            }
            @if (contentMode === 'bedtime' || contentMode === 'both') {
              <section class="reader-story reader-bedtime"><span class="reader-section-label">నిద్రవేళ కథ · BEDTIME STORY</span><p>{{ vm.chapter.bedtimeVersion }}</p></section>
            }
          </div>

          <section class="reader-illustration" aria-label="Chapter illustration">
            <img [src]="vm.chapter.illustrationPath" [alt]="vm.chapter.chapterTitle || 'Story illustration'" loading="lazy" (error)="imageMissing = true" [hidden]="imageMissing">
            <div class="reader-illustration-placeholder" [hidden]="!imageMissing"><span>☾</span><b>చిత్రం త్వరలో</b><strong>Illustration Coming Soon</strong><p>{{ vm.chapter.illustrationPrompt }}</p></div>
          </section>
        </div>

        <div class="reader-secondary-links">
          <a [routerLink]="['/book', vm.book.id]">పుస్తకం వివరాలు · Book details</a>
          <a [routerLink]="['/book', vm.book.id, 'print']">Print / PDF</a>
          <button type="button" (click)="openChapters()">అధ్యాయాలు · Chapters</button>
        </div>

        <nav class="reader-floating-nav no-print" aria-label="Chapter navigation">
          <button type="button" class="reader-nav-btn previous" (click)="goToChapter(vm.book, vm.chapter.chapterNumber - 1)" [disabled]="vm.chapter.chapterNumber === 1" aria-label="Previous chapter">← Previous</button>
          <span class="reader-progress-pill">{{ vm.chapter.chapterNumber }} / {{ vm.book.chapters.length }}</span>
          <button type="button" class="reader-nav-btn next" (click)="goToChapter(vm.book, vm.chapter.chapterNumber + 1)" [disabled]="vm.chapter.chapterNumber === vm.book.chapters.length" aria-label="Next chapter">Next →</button>
        </nav>

        <nav class="mobile-reader-nav no-print" aria-label="Mobile chapter navigation">
          <button type="button" class="reader-nav-btn previous" (click)="goToChapter(vm.book, vm.chapter.chapterNumber - 1)" [disabled]="vm.chapter.chapterNumber === 1" aria-label="Previous chapter">← <span>Previous</span></button>
          <span class="reader-progress-pill">{{ vm.chapter.chapterNumber }} / {{ vm.book.chapters.length }}</span>
          <button type="button" class="reader-nav-btn next" (click)="goToChapter(vm.book, vm.chapter.chapterNumber + 1)" [disabled]="vm.chapter.chapterNumber === vm.book.chapters.length" aria-label="Next chapter"><span>Next</span> →</button>
        </nav>

        @if (chapterSheetOpen) {
          <div class="chapter-sheet-backdrop" role="presentation" (click)="closeFromBackdrop($event)">
            <section class="chapter-sheet" role="dialog" aria-modal="true" aria-labelledby="chapter-sheet-title">
              <header><div><span>అధ్యాయాలు</span><h2 id="chapter-sheet-title">Chapters</h2></div><button type="button" (click)="closeChapters()" aria-label="Close chapter list">×</button></header>
              <div class="chapter-sheet-list">
                @for (chapter of vm.book.chapters; track chapter.chapterNumber) {
                  <button type="button" [class.active]="chapter.chapterNumber === vm.chapter.chapterNumber" (click)="selectChapter(vm.book, chapter.chapterNumber)"><span>{{ chapter.chapterNumber }}</span><b>{{ chapter.chapterTitleTelugu }}</b></button>
                }
              </div>
            </section>
          </div>
        }
      </article>
    } }
  `
})
export class MobileReaderComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly data = inject(StorybookDataService);
  private touchStartX = 0;
  private touchStartY = 0;
  private currentBook: Book | null = null;
  private currentChapter: Chapter | null = null;

  theme: ReaderTheme;
  fontSize: ReaderFontSize;
  contentMode: ReaderContentMode;
  chapterSheetOpen = false;
  imageMissing = false;

  readonly vm$ = combineLatest([this.route.paramMap]).pipe(
    map(([params]) => ({ id: params.get('bookId') ?? '', chapterNumber: Number(params.get('chapterNumber')) })),
    switchMap(({ id, chapterNumber }) => this.data.getBook(id).pipe(map(book => ({ book, chapter: book?.chapters.find(item => item.chapterNumber === chapterNumber) ?? null })))),
    tap(({ book, chapter }) => { this.currentBook = book; this.currentChapter = chapter; this.imageMissing = false; this.chapterSheetOpen = false; })
  );

  constructor() {
    const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
    this.theme = this.readPreference<ReaderTheme>('reader.theme', 'warm');
    this.fontSize = this.readFontSizePreference();
    this.contentMode = this.readPreference<ReaderContentMode>('reader.contentMode', mobile ? 'bedtime' : 'meaning');
  }

  get modeLabel(): string { return this.contentMode === 'bedtime' ? 'Bedtime' : this.contentMode === 'meaning' ? 'Meaning' : 'Both'; }
  get fontLabel(): string { return this.fontSize === 'small' ? 'Aa Small' : this.fontSize === 'large' ? 'Aa Large' : 'Aa Medium'; }

  toggleTheme(): void { this.theme = this.theme === 'warm' ? 'night' : 'warm'; this.savePreference('reader.theme', this.theme); }
  cycleFontSize(): void { const values: ReaderFontSize[] = ['small', 'medium', 'large']; this.fontSize = values[(values.indexOf(this.fontSize) + 1) % values.length]; this.savePreference('reader.fontSize', this.fontSize); }
  cycleContentMode(): void { const values: ReaderContentMode[] = ['bedtime', 'meaning', 'both']; this.contentMode = values[(values.indexOf(this.contentMode) + 1) % values.length]; this.savePreference('reader.contentMode', this.contentMode); }
  openChapters(): void { this.chapterSheetOpen = true; }
  closeChapters(): void { this.chapterSheetOpen = false; }
  closeFromBackdrop(event: MouseEvent): void { if (event.target === event.currentTarget) this.closeChapters(); }
  selectChapter(book: Book, chapterNumber: number): void { this.closeChapters(); this.goToChapter(book, chapterNumber); }
  goToChapter(book: Book, chapterNumber: number): void {
    if (chapterNumber < 1 || chapterNumber > book.chapters.length) return;
    void this.router.navigate(['/book', book.id, 'read', chapterNumber]).then(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  }

  onTouchStart(event: TouchEvent): void { const touch = event.changedTouches[0]; this.touchStartX = touch.clientX; this.touchStartY = touch.clientY; }
  onTouchEnd(event: TouchEvent, book: Book, chapter: Chapter): void {
    const touch = event.changedTouches[0];
    const distanceX = touch.clientX - this.touchStartX;
    const distanceY = touch.clientY - this.touchStartY;
    if (Math.abs(distanceX) > 60 && Math.abs(distanceY) < 50) this.goToChapter(book, chapter.chapterNumber + (distanceX < 0 ? 1 : -1));
  }

  @HostListener('document:keydown', ['$event']) onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.chapterSheetOpen) this.closeChapters();
      else if (this.currentBook) void this.router.navigate(['/book', this.currentBook.id]);
      return;
    }
    if (!this.currentBook || !this.currentChapter) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); this.goToChapter(this.currentBook, this.currentChapter.chapterNumber + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); this.goToChapter(this.currentBook, this.currentChapter.chapterNumber - 1); }
  }

  private readPreference<T extends string>(key: string, fallback: T): T {
    if (typeof localStorage === 'undefined') return fallback;
    return (localStorage.getItem(key) as T | null) ?? fallback;
  }
  private readFontSizePreference(): ReaderFontSize {
    const stored = this.readPreference<string>('reader.fontSize', 'medium');
    if (stored === 'small' || stored === 'medium' || stored === 'large') return stored;
    return stored === 'xlarge' ? 'large' : 'medium';
  }
  private savePreference(key: string, value: string): void { if (typeof localStorage !== 'undefined') localStorage.setItem(key, value); }
}
