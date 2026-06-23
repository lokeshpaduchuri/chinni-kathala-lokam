import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="app-footer no-print">
      <div class="footer-divider" aria-hidden="true"><span>♥</span></div>
      <p>Made with love for Maitri &amp; Mayukha</p>
      <p class="footer-telugu">మైత్రి &amp; మయూఖ కోసం ప్రేమతో</p>
    </footer>
  `
})
export class AppFooterComponent {}
