import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({ selector: 'app-root', standalone: true, imports: [RouterLink, RouterOutlet], template: `
  <header class="site-header no-print">
    <a class="brand" routerLink="/" aria-label="చిన్ని కథల లోకం home"><span class="brand-mark">చి</span><span><b>చిన్ని కథల లోకం</b><small>తెలుగు కథలు చిన్న హృదయాల కోసం</small></span></a>
    <a class="library-link" routerLink="/"><span>✦</span> కథల గ్రంథాలయం</a>
  </header>
  <main><router-outlet /></main>
  <footer class="site-footer no-print"><span>❦</span><p>ప్రతి కథ ఒక చిన్న వెలుగు</p><small>Every story is a little light</small></footer>
` })
export class AppComponent {}
