import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-chapter-navigation', standalone: true, imports: [RouterLink], template: `
  <nav class="chapter-nav no-print" aria-label="Chapter navigation">
    @if (chapterNumber > 1) { <a [routerLink]="['/book', bookId, 'read', chapterNumber - 1]">← మునుపటి అధ్యాయం</a> } @else { <span></span> }
    <a class="contents" [routerLink]="['/book', bookId]">☰ విషయ సూచిక</a>
    @if (chapterNumber < total) { <a [routerLink]="['/book', bookId, 'read', chapterNumber + 1]">తదుపరి అధ్యాయం →</a> } @else { <a [routerLink]="['/book', bookId]">పుస్తకం ముగింపు →</a> }
  </nav>
` })
export class ChapterNavigationComponent { @Input({ required: true }) bookId!: string; @Input({ required: true }) chapterNumber!: number; @Input({ required: true }) total!: number; }
