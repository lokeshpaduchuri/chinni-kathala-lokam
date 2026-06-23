export interface LibraryBook {
  id: string; slug: string; titleTelugu: string; titleEnglish: string; subtitle: string;
  description: string; category: string; ageRange: string; coverImage: string; featured: boolean; available: boolean; chapterCount: number;
}
export interface Library { brand: { titleTelugu: string; titleEnglish: string; tagline: string }; books: LibraryBook[]; }
export interface Chapter { chapterNumber: number; chapterTitle: string; chapterTitleTelugu: string; teluguVerse: string; meaning: string; bedtimeVersion: string; illustrationPath: string; illustrationPrompt: string; }
export interface Book { id: string; titleTelugu: string; titleEnglish: string; subtitle: string; dedication: string; introduction: string; closingBlessing: string; chapters: Chapter[]; }
