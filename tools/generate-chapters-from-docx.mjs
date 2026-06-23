import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXPECTED_VERSE_COUNT = 34;
const PROJECT_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DEFAULT_SOURCE_DIR = resolve(PROJECT_ROOT, 'source-docx');
const DEFAULT_MEANING_DOCX = resolve(DEFAULT_SOURCE_DIR, 'Kasturi_Ranga_Ranga_Meaning_Version_FULL.docx');
const DEFAULT_BEDTIME_DOCX = resolve(DEFAULT_SOURCE_DIR, 'Kasturi_Ranga_Ranga_Bedtime_Story_Version_FULL.docx');
const DEFAULT_OUTPUT = resolve(PROJECT_ROOT, 'src/assets/data/books/chinni-krishnuni-leelalu.json');

const meaningDocx = resolve(process.argv[2] ?? DEFAULT_MEANING_DOCX);
const bedtimeDocx = resolve(process.argv[3] ?? DEFAULT_BEDTIME_DOCX);
const outputPath = resolve(process.argv[4] ?? DEFAULT_OUTPUT);

function decodeXml(text) {
  return text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&#x([\da-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)));
}

function extractDocumentXml(docxPath) {
  const result = spawnSync('unzip', ['-p', docxPath, 'word/document.xml'], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024
  });

  if (result.error) {
    throw new Error(`Unable to read DOCX ${docxPath}: ${result.error.message}`);
  }
  if (result.status !== 0 || !result.stdout) {
    throw new Error(`Unable to extract word/document.xml from ${docxPath}: ${result.stderr.trim()}`);
  }
  return result.stdout;
}

function extractParagraphs(docxPath) {
  const xml = extractDocumentXml(docxPath);
  const paragraphXml = xml.match(/<w:p\b[\s\S]*?<\/w:p>/g) ?? [];

  return paragraphXml.map((paragraph) => {
    const tokens = paragraph.match(/<w:t\b[^>]*>[\s\S]*?<\/w:t>|<w:(?:br|cr)\b[^>]*\/?\s*>|<w:tab\b[^>]*\/?\s*>/g) ?? [];
    return tokens.map((token) => {
      if (/^<w:(?:br|cr)\b/.test(token)) return '\n';
      if (/^<w:tab\b/.test(token)) return '\t';
      return decodeXml(token.replace(/^<w:t\b[^>]*>/, '').replace(/<\/w:t>$/, ''));
    }).join('');
  });
}

function parseVerses(docxPath) {
  const paragraphs = extractParagraphs(docxPath);
  const markerPattern = /^Verse \((\d+)\)\s*[–-]\s*$/;
  const markerIndexes = paragraphs
    .map((text, index) => ({ match: text.trim().match(markerPattern), index }))
    .filter(({ match }) => match)
    .map(({ match, index }) => ({ number: Number(match[1]), index }));

  return markerIndexes.map((marker, markerIndex) => {
    const nextIndex = markerIndexes[markerIndex + 1]?.index ?? paragraphs.length;
    const section = paragraphs.slice(marker.index + 1, nextIndex);
    const meaningLabelIndex = section.findIndex((text) => text.trim() === 'Meaning:');

    if (meaningLabelIndex < 0) {
      throw new Error(`Verse ${marker.number} in ${docxPath} has no Meaning: label.`);
    }

    const teluguVerse = section
      .slice(0, meaningLabelIndex)
      .filter((text) => text.length > 0)
      .join('\n\n')
      .trim();
    const meaning = section
      .slice(meaningLabelIndex + 1)
      .filter((text) => text.length > 0)
      .join('\n\n')
      .trim();

    if (!teluguVerse || !meaning) {
      throw new Error(`Verse ${marker.number} in ${docxPath} is missing Telugu or meaning text.`);
    }
    return { number: marker.number, teluguVerse, meaning };
  });
}

function validateVerses(label, verses) {
  if (verses.length !== EXPECTED_VERSE_COUNT) {
    throw new Error(`${label} contains ${verses.length} verses; expected exactly ${EXPECTED_VERSE_COUNT}.`);
  }
  verses.forEach((verse, index) => {
    const expectedNumber = index + 1;
    if (verse.number !== expectedNumber) {
      throw new Error(`${label} verse sequence mismatch: expected ${expectedNumber}, found ${verse.number}.`);
    }
  });
}

const meaningVerses = parseVerses(meaningDocx);
const bedtimeVerses = parseVerses(bedtimeDocx);
validateVerses('Meaning Version', meaningVerses);
validateVerses('Bedtime Story Version', bedtimeVerses);

if (meaningVerses.length !== bedtimeVerses.length) {
  throw new Error(`Verse counts do not match: meaning=${meaningVerses.length}, bedtime=${bedtimeVerses.length}.`);
}

const chapters = meaningVerses.map((verse, index) => {
  const bedtime = bedtimeVerses[index];
  if (verse.number !== bedtime.number) {
    throw new Error(`Verse number mismatch at index ${index}: meaning=${verse.number}, bedtime=${bedtime.number}.`);
  }
  return {
    chapterNumber: verse.number,
    chapterTitle: `Verse ${verse.number}`,
    chapterTitleTelugu: verse.teluguVerse.split('\n')[0],
    teluguVerse: verse.teluguVerse,
    meaning: verse.meaning,
    bedtimeVersion: bedtime.meaning,
    illustrationPath: `assets/images/illustrations/chinni-krishnuni-leelalu/Verse-${verse.number}.webp`,
    illustrationPrompt: 'A soft Indian watercolor illustration representing this verse.'
  };
});

const book = JSON.parse(await readFile(outputPath, 'utf8'));
book.chapters = chapters;
await writeFile(outputPath, `${JSON.stringify(book, null, 2)}\n`, 'utf8');

console.log(`Wrote ${chapters.length} chapters to ${outputPath}`);
