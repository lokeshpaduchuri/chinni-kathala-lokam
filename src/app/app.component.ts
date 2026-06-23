import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppFooterComponent } from './components/app-footer.component';

@Component({ selector: 'app-root', standalone: true, imports: [RouterLink, RouterOutlet, AppFooterComponent], template: `
  <header class="site-header no-print">
    <a class="brand" routerLink="/" aria-label="చిన్ని కథల లోకం home"><span class="brand-mark">చి</span><span><b>చిన్ని కథల లోకం</b><small>తెలుగు కథలు చిన్న హృదయాల కోసం</small></span></a>
    <a class="library-link" routerLink="/"><span>✦</span> కథల గ్రంథాలయం</a>
  </header>
  <main><router-outlet /></main>
  <app-footer />
` })
export class AppComponent {}
