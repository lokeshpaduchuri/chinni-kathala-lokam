import { Component, Input } from '@angular/core';
import { Book } from '../models/storybook.models';
@Component({ selector: 'app-book-introduction', standalone: true, template: `
  <section class="introduction"><div class="intro-label">ఈ పుస్తకం గురించి · ABOUT THIS BOOK</div><p class="dedication">“{{ book.dedication }}”</p><div class="small-rule">❦</div><p>{{ book.introduction }}</p></section>
` })
export class BookIntroductionComponent { @Input({ required: true }) book!: Book; }
