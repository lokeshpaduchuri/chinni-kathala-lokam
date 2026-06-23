export function getTonightChapter(chapterCount: number, date = new Date()): number {
  if (chapterCount < 1) return 1;
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000) + 1;
  return (dayOfYear % chapterCount) + 1;
}
