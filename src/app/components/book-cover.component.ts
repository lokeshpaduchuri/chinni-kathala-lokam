import { Component, Input } from '@angular/core';
import { LibraryBook } from '../models/storybook.models';

@Component({ selector: 'app-book-cover', standalone: true, template: `
  <div class="book-cover" [class.compact]="compact">
    <div class="cover-border"><span class="peacock">🦚</span><span class="cover-kicker">చిన్ని కథల లోకం సమర్పణ</span><h2>{{ book.titleTelugu }}</h2><div class="flourish">◆ ❋ ◆</div><h3>{{ book.titleEnglish }}</h3><p>{{ book.subtitle }}</p><span class="cover-bottom">తెలుగు బాలల కథామాలిక</span></div>
  </div>
` })
export class BookCoverComponent { @Input({ required: true }) book!: LibraryBook; @Input() compact = false; }
