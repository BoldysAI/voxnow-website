/**
 * Génère public/VoxNow-CGUV.pdf à partir de docs/cguv-source.md
 * Usage: node scripts/generate-cguv-pdf.mjs
 */
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const mdPath = path.join(root, 'docs/cguv-source.md');
const outPath = path.join(root, 'public/VoxNow-CGUV.pdf');

function stripMd(s) {
  return s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
}

const raw = fs.readFileSync(mdPath, 'utf8');
const lines = raw.split('\n');

const doc = new PDFDocument({ size: 'A4', margin: 50 });
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

const pageWidth = 495;

doc.font('Helvetica');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  if (trimmed === '') {
    doc.moveDown(0.12);
    continue;
  }
  if (trimmed === '---') {
    doc.moveDown(0.4);
    continue;
  }
  if (line.startsWith('# ')) {
    doc.moveDown(0.45);
    doc.fontSize(18).font('Helvetica-Bold').text(stripMd(line.slice(2)), { width: pageWidth });
    doc.font('Helvetica');
    doc.moveDown(0.4);
    continue;
  }
  if (line.startsWith('## ')) {
    doc.moveDown(0.35);
    doc.fontSize(14).font('Helvetica-Bold').text(stripMd(line.slice(3)), { width: pageWidth });
    doc.font('Helvetica');
    doc.moveDown(0.3);
    continue;
  }
  if (line.startsWith('### ')) {
    doc.fontSize(12).font('Helvetica-Bold').text(stripMd(line.slice(4)), { width: pageWidth });
    doc.font('Helvetica');
    doc.moveDown(0.22);
    continue;
  }
  if (trimmed.startsWith('- ')) {
    doc.fontSize(11).text('• ' + stripMd(trimmed.slice(2)), { width: pageWidth, indent: 12 });
    doc.moveDown(0.15);
    continue;
  }

  doc.fontSize(11).text(stripMd(line), { width: pageWidth, align: 'left' });
  doc.moveDown(0.18);
}

doc.end();

stream.on('finish', () => {
  console.log('Écrit:', outPath);
});
