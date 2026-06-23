import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { StorybookDataService } from '../services/storybook-data.service';
import { BookCardComponent } from './book-card.component';

@Component({ selector: 'app-library-home', standalone: true, imports: [AsyncPipe, BookCardComponent], template: `
  @if (library$ | async; as library) {
    <section class="hero"><div class="hero-ornament">✦</div><p class="overline">A LITTLE LIBRARY OF WONDER</p><h1>{{ library.brand.titleTelugu }}</h1><h2>{{ library.brand.titleEnglish }}</h2><div class="lotus-rule"><span></span>❀<span></span></div><p class="tagline">{{ library.brand.tagline }}</p><p class="hero-copy">చిన్నారుల ఊహలకు రెక్కలు తొడిగే కథలు — ప్రేమతో, భక్తితో, తెలుగు పరిమళంతో.</p><a href="#collections" class="primary-button">కథలు చూడండి <span>↓</span></a></section>
    <section id="collections" class="collection-section"><header class="section-heading"><p class="overline">OUR STORY COLLECTIONS</p><h2>కథల ఖజానా</h2><p>Stories to cherish, remember, and share.</p></header>
      <div class="book-grid">@for (book of library.books; track book.id) { <app-book-card [book]="book" /> }</div>
    </section>
  }
` })
export class LibraryHomeComponent { readonly library$ = inject(StorybookDataService).getLibrary(); }
