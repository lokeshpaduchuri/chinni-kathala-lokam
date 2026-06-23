import { Component, Input } from '@angular/core';
import { Chapter } from '../models/storybook.models';
@Component({ selector: 'app-chapter-page', standalone: true, template: `
  <article class="chapter-page">
    <header><span class="chapter-label">అధ్యాయం {{ chapter.chapterNumber }} · CHAPTER {{ chapter.chapterNumber }}</span><h2>{{ chapter.chapterTitleTelugu }}</h2><h3>{{ chapter.chapterTitle }}</h3></header>
    <div class="chapter-layout">
      <div class="verse-panel"><span class="quote-mark">“</span><p class="telugu-verse">{{ chapter.teluguVerse }}</p><div class="meaning"><span>కథ భావం · THE STORY</span><p>{{ chapter.meaning }}</p></div></div>
      <div class="illustration-panel">
        <div class="illustration-frame"><img [src]="chapter.illustrationPath" [alt]="chapter.chapterTitle || 'Story illustration'" loading="lazy" (error)="imageMissing = true" [hidden]="imageMissing"><div class="illustration-placeholder" [hidden]="!imageMissing"><div class="moon">☾</div><span>చిత్రం త్వరలో</span><b>Illustration Coming Soon</b><p>{{ chapter.illustrationPrompt }}</p></div></div>
      </div>
    </div>
  </article>
` })
export class ChapterPageComponent { @Input({ required: true }) chapter!: Chapter; imageMissing = false; }
