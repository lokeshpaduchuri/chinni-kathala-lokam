import { Component, Input } from '@angular/core';
@Component({ selector: 'app-closing-blessing', standalone: true, template: `<section class="blessing"><span>🪷</span><p>{{ text }}</p><div>శుభం · THE END</div></section>` })
export class ClosingBlessingComponent { @Input({ required: true }) text!: string; }
