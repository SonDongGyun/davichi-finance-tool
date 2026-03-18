import PptxGenJS from 'pptxgenjs';
import { formatMoney, formatMonthLabel } from './excelParser';

const STATUS_KR = { new: '신규', removed: '제거', increased: '증가', decreased: '감소', unchanged: '동일' };
const BG = '0F172A';
const CARD_BG = '1E293B';
const BORDER = '334155';
const TEXT = 'E2E8F0';
const SUB = '94A3B8';
const DIM = '64748B';
const BLUE = '3B82F6';
const PURPLE = '8B5CF6';
const RED = 'EF4444';
const GREEN = '10B981';
const ORANGE = 'F97316';
const CYAN = '06B6D4';
const YELLOW = 'F59E0B';

function addSlideNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 11.5, y: 7.0, w: 1.5, h: 0.3,
    fontSize: 8, color: DIM, align: 'right', fontFace: 'Arial',
  });
}

export function exportPptx(result) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Davichi Finance Tool';
  pptx.subject = 'Monthly Cost Analysis';

  const m1 = formatMonthLabel(result.month1.label);
  const m2 = formatMonthLabel(result.month2.label);
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const diffSign = result.totalDiff >= 0 ? '+' : '';
  const allSlides = [];

  // ═══════════ Slide 1: Title ═══════════
  const s1 = pptx.addSlide();
  allSlides.push(s1);
  s1.background = { color: BG };

  // Blue accent bar
  s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: BLUE } });

  s1.addText('Monthly Cost Analysis', {
    x: 0.8, y: 1.5, w: 11.5, h: 0.9,
    fontSize: 38, fontFace: 'Arial', color: TEXT, bold: true,
  });
  s1.addText(`${m1}  vs  ${m2}`, {
    x: 0.8, y: 2.5, w: 11.5, h: 0.6,
    fontSize: 24, fontFace: 'Arial', color: BLUE, bold: true,
  });

  s1.addShape(pptx.ShapeType.rect, { x: 0.8, y: 3.4, w: 3.5, h: 0.06, fill: { color: BLUE } });

  s1.addText(`Davichi Finance Team`, {
    x: 0.8, y: 3.8, w: 6, h: 0.4,
    fontSize: 14, fontFace: 'Arial', color: SUB,
  });
  s1.addText(today, {
    x: 0.8, y: 4.2, w: 6, h: 0.35,
    fontSize: 11, fontFace: 'Arial', color: DIM,
  });

  // ═══════════ Slide 2: Executive Summary ═══════════
  const s2 = pptx.addSlide();
  allSlides.push(s2);
  s2.background = { color: BG };
  s2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: BLUE } });

  s2.addText('Executive Summary', {
    x: 0.8, y: 0.3, w: 8, h: 0.6,
    fontSize: 24, fontFace: 'Arial', color: TEXT, bold: true,
  });

  // 3 summary cards
  const cards = [
    { label: m1, value: `${formatMoney(result.month1.total)}`, sub: `${result.month1.count} items`, accent: '475569' },
    { label: m2, value: `${formatMoney(result.month2.total)}`, sub: `${result.month2.count} items`, accent: BLUE },
    { label: 'Difference', value: `${diffSign}${formatMoney(result.totalDiff)}`, sub: `${diffSign}${result.totalPctChange}%`, accent: result.totalDiff >= 0 ? RED : GREEN },
  ];

  cards.forEach((c, i) => {
    const x = 0.8 + i * 3.8;
    s2.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.2, w: 3.4, h: 1.8,
      fill: { color: CARD_BG }, line: { color: BORDER, width: 1 }, rectRadius: 0.12,
    });
    // Accent top bar
    s2.addShape(pptx.ShapeType.rect, { x: x + 0.1, y: 1.2, w: 3.2, h: 0.06, fill: { color: c.accent } });
    s2.addText(c.label, { x, y: 1.4, w: 3.4, h: 0.35, fontSize: 11, color: SUB, align: 'center', fontFace: 'Arial' });
    s2.addText(c.value + ' won', { x, y: 1.75, w: 3.4, h: 0.55, fontSize: 20, color: TEXT, bold: true, align: 'center', fontFace: 'Arial' });
    s2.addText(c.sub, { x, y: 2.35, w: 3.4, h: 0.35, fontSize: 13, color: c.accent, align: 'center', bold: true, fontFace: 'Arial' });
  });

  // 4 change count cards
  const changes = [
    { label: 'New Items', count: result.newItems.length, color: BLUE },
    { label: 'Removed', count: result.removedItems.length, color: ORANGE },
    { label: 'Increased', count: result.increasedItems.length, color: RED },
    { label: 'Decreased', count: result.decreasedItems.length, color: GREEN },
  ];

  changes.forEach((c, i) => {
    const x = 0.8 + i * 2.9;
    s2.addShape(pptx.ShapeType.roundRect, {
      x, y: 3.4, w: 2.6, h: 1.3,
      fill: { color: CARD_BG }, line: { color: BORDER, width: 1 }, rectRadius: 0.1,
    });
    s2.addText(c.label, { x, y: 3.5, w: 2.6, h: 0.35, fontSize: 10, color: c.color, align: 'center', fontFace: 'Arial' });
    s2.addText(String(c.count), { x, y: 3.9, w: 2.6, h: 0.65, fontSize: 30, color: TEXT, bold: true, align: 'center', fontFace: 'Arial' });
  });

  // Key insight box
  s2.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 5.1, w: 11.5, h: 1.4,
    fill: { color: '1A1A2E' }, line: { color: YELLOW, width: 1 }, rectRadius: 0.1,
  });
  s2.addText('Key Insight', {
    x: 1.2, y: 5.2, w: 3, h: 0.35,
    fontSize: 11, color: YELLOW, bold: true, fontFace: 'Arial',
  });

  const insights = [];
  if (result.totalDiff > 0) {
    insights.push(`Total cost increased by ${formatMoney(result.totalDiff)} won (${diffSign}${result.totalPctChange}%).`);
  } else if (result.totalDiff < 0) {
    insights.push(`Total cost decreased by ${formatMoney(Math.abs(result.totalDiff))} won (${result.totalPctChange}%).`);
  }
  if (result.newItems.length > 0) {
    insights.push(`New items: ${result.newItems.map(i => i.category).join(', ')}`);
  }
  if (result.removedItems.length > 0) {
    insights.push(`Removed items: ${result.removedItems.map(i => i.category).join(', ')}`);
  }

  s2.addText(insights.join('\n'), {
    x: 1.2, y: 5.55, w: 10.8, h: 0.85,
    fontSize: 10, color: 'CBD5E1', fontFace: 'Arial', lineSpacing: 18,
  });

  // ═══════════ Slide 3+: Analysis Detail ═══════════
  const lines = [];

  if (result.totalDiff !== 0) {
    const dir = result.totalDiff > 0 ? 'increased' : 'decreased';
    lines.push({ color: BLUE, tag: 'TOTAL', text: `Total cost ${dir} by ${formatMoney(Math.abs(result.totalDiff))} won (${diffSign}${result.totalPctChange}%) from ${m1} to ${m2}.` });
  }

  result.removedItems.forEach(item => {
    lines.push({ color: ORANGE, tag: 'REMOVED', text: `${item.category}: ${formatMoney(item.prevAmount)} won in ${m1}, none in ${m2}.` });
  });
  result.newItems.forEach(item => {
    lines.push({ color: BLUE, tag: 'NEW', text: `${item.category}: ${formatMoney(item.currAmount)} won newly occurred in ${m2}.` });
  });
  result.increasedItems.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)).forEach(item => {
    lines.push({ color: RED, tag: 'UP', text: `${item.category}: ${formatMoney(item.prevAmount)} -> ${formatMoney(item.currAmount)} won (+${formatMoney(item.diff)} won, +${item.pctChange}%)` });
  });
  result.decreasedItems.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)).forEach(item => {
    lines.push({ color: GREEN, tag: 'DOWN', text: `${item.category}: ${formatMoney(item.prevAmount)} -> ${formatMoney(item.currAmount)} won (-${formatMoney(Math.abs(item.diff))} won, ${item.pctChange}%)` });
  });

  // Vendor changes
  result.vendorComparison.forEach(v => {
    if (v.status === 'new') {
      lines.push({ color: CYAN, tag: 'VENDOR+', text: `"${v.vendor}" new vendor, ${formatMoney(v.currAmount)} won.` });
    } else if (v.status === 'removed') {
      lines.push({ color: ORANGE, tag: 'VENDOR-', text: `"${v.vendor}" no transaction in ${m2} (was ${formatMoney(v.prevAmount)} won).` });
    } else if (v.diff > 0) {
      lines.push({ color: RED, tag: 'VENDOR', text: `"${v.vendor}" +${formatMoney(v.diff)} won.` });
    } else if (v.diff < 0) {
      lines.push({ color: GREEN, tag: 'VENDOR', text: `"${v.vendor}" -${formatMoney(Math.abs(v.diff))} won.` });
    }
  });

  const maxLines = 13;
  for (let i = 0; i < lines.length; i += maxLines) {
    const slide = pptx.addSlide();
    allSlides.push(slide);
    slide.background = { color: BG };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: BLUE } });

    slide.addText(i === 0 ? 'Detailed Analysis' : `Detailed Analysis (cont.)`, {
      x: 0.8, y: 0.3, w: 8, h: 0.6,
      fontSize: 24, fontFace: 'Arial', color: TEXT, bold: true,
    });

    const page = lines.slice(i, i + maxLines);
    page.forEach((line, idx) => {
      const yPos = 1.2 + idx * 0.42;

      // Tag badge
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8, y: yPos + 0.02, w: 0.85, h: 0.28,
        fill: { color: line.color }, rectRadius: 0.05,
      });
      slide.addText(line.tag, {
        x: 0.8, y: yPos, w: 0.85, h: 0.32,
        fontSize: 7, color: 'FFFFFF', bold: true, align: 'center', fontFace: 'Arial',
      });
      slide.addText(line.text, {
        x: 1.8, y: yPos, w: 11, h: 0.34,
        fontSize: 11, fontFace: 'Arial', color: 'CBD5E1',
      });
    });
  }

  // ═══════════ Category Table Slides ═══════════
  const catRows = result.categoryComparison.map(c => [
    { text: c.category, options: { fontSize: 9, color: TEXT, fontFace: 'Arial' } },
    { text: `${formatMoney(c.prevAmount)}`, options: { fontSize: 9, color: 'CBD5E1', align: 'right', fontFace: 'Arial' } },
    { text: `${formatMoney(c.currAmount)}`, options: { fontSize: 9, color: 'CBD5E1', align: 'right', fontFace: 'Arial' } },
    { text: `${c.diff >= 0 ? '+' : ''}${formatMoney(c.diff)}`, options: { fontSize: 9, color: c.diff > 0 ? RED : c.diff < 0 ? GREEN : SUB, align: 'right', bold: true, fontFace: 'Arial' } },
    { text: `${c.pctChange >= 0 ? '+' : ''}${c.pctChange}%`, options: { fontSize: 9, color: c.diff > 0 ? RED : c.diff < 0 ? GREEN : SUB, align: 'right', fontFace: 'Arial' } },
    { text: STATUS_KR[c.status], options: { fontSize: 9, color: c.status === 'new' ? BLUE : c.status === 'removed' ? ORANGE : c.status === 'increased' ? RED : c.status === 'decreased' ? GREEN : SUB, align: 'center', bold: true, fontFace: 'Arial' } },
  ]);

  const rowsPerPage = 14;
  for (let i = 0; i < catRows.length; i += rowsPerPage) {
    const slide = pptx.addSlide();
    allSlides.push(slide);
    slide.background = { color: BG };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: BLUE } });

    slide.addText(i === 0 ? 'Category Comparison' : `Category Comparison (cont.)`, {
      x: 0.8, y: 0.3, w: 8, h: 0.5,
      fontSize: 22, fontFace: 'Arial', color: TEXT, bold: true,
    });

    const headerRow = [
      { text: 'Category', options: { fontSize: 9, bold: true, color: 'FFFFFF', fill: { color: BLUE }, fontFace: 'Arial' } },
      { text: m1, options: { fontSize: 9, bold: true, color: 'FFFFFF', fill: { color: BLUE }, align: 'right', fontFace: 'Arial' } },
      { text: m2, options: { fontSize: 9, bold: true, color: 'FFFFFF', fill: { color: BLUE }, align: 'right', fontFace: 'Arial' } },
      { text: 'Diff', options: { fontSize: 9, bold: true, color: 'FFFFFF', fill: { color: BLUE }, align: 'right', fontFace: 'Arial' } },
      { text: '%', options: { fontSize: 9, bold: true, color: 'FFFFFF', fill: { color: BLUE }, align: 'right', fontFace: 'Arial' } },
      { text: 'Status', options: { fontSize: 9, bold: true, color: 'FFFFFF', fill: { color: BLUE }, align: 'center', fontFace: 'Arial' } },
    ];

    const chunk = catRows.slice(i, i + rowsPerPage);
    const tableRows = [headerRow, ...chunk.map((row, idx) => row.map(cell => ({
      ...cell,
      options: { ...cell.options, fill: { color: idx % 2 === 0 ? CARD_BG : '172033' } },
    })))];

    slide.addTable(tableRows, {
      x: 0.5, y: 1.0, w: 12.3,
      colW: [3.5, 2, 2, 2, 1.3, 1.5],
      border: { type: 'solid', pt: 0.5, color: BORDER },
      rowH: 0.33,
    });
  }

  // ═══════════ Vendor Table Slides ═══════════
  if (result.vendorComparison.length > 0) {
    const vendorRows = result.vendorComparison.map(v => [
      { text: v.vendor, options: { fontSize: 9, color: TEXT, fontFace: 'Arial' } },
      { text: `${formatMoney(v.prevAmount)}`, options: { fontSize: 9, color: 'CBD5E1', align: 'right', fontFace: 'Arial' } },
      { text: `${formatMoney(v.currAmount)}`, options: { fontSize: 9, color: 'CBD5E1', align: 'right', fontFace: 'Arial' } },
      { text: `${v.diff >= 0 ? '+' : ''}${formatMoney(v.diff)}`, options: { fontSize: 9, color: v.diff > 0 ? RED : GREEN, align: 'right', bold: true, fontFace: 'Arial' } },
      { text: STATUS_KR[v.status] || '-', options: { fontSize: 9, color: v.status === 'new' ? BLUE : v.status === 'removed' ? ORANGE : v.diff > 0 ? RED : GREEN, align: 'center', bold: true, fontFace: 'Arial' } },
    ]);

    for (let i = 0; i < vendorRows.length; i += rowsPerPage) {
      const slide = pptx.addSlide();
      allSlides.push(slide);
      slide.background = { color: BG };
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: CYAN } });

      slide.addText(i === 0 ? 'Vendor Changes' : `Vendor Changes (cont.)`, {
        x: 0.8, y: 0.3, w: 8, h: 0.5,
        fontSize: 22, fontFace: 'Arial', color: TEXT, bold: true,
      });

      const headerRow = [
        { text: 'Vendor', options: { fontSize: 9, bold: true, color: 'FFFFFF', fill: { color: CYAN }, fontFace: 'Arial' } },
        { text: m1, options: { fontSize: 9, bold: true, color: 'FFFFFF', fill: { color: CYAN }, align: 'right', fontFace: 'Arial' } },
        { text: m2, options: { fontSize: 9, bold: true, color: 'FFFFFF', fill: { color: CYAN }, align: 'right', fontFace: 'Arial' } },
        { text: 'Diff', options: { fontSize: 9, bold: true, color: 'FFFFFF', fill: { color: CYAN }, align: 'right', fontFace: 'Arial' } },
        { text: 'Status', options: { fontSize: 9, bold: true, color: 'FFFFFF', fill: { color: CYAN }, align: 'center', fontFace: 'Arial' } },
      ];

      const chunk = vendorRows.slice(i, i + rowsPerPage);
      const tableRows = [headerRow, ...chunk.map((row, idx) => row.map(cell => ({
        ...cell,
        options: { ...cell.options, fill: { color: idx % 2 === 0 ? CARD_BG : '172033' } },
      })))];

      slide.addTable(tableRows, {
        x: 0.5, y: 1.0, w: 12.3,
        colW: [4, 2.2, 2.2, 2.2, 1.7],
        border: { type: 'solid', pt: 0.5, color: BORDER },
        rowH: 0.33,
      });
    }
  }

  // ═══════════ Thank You Slide ═══════════
  const sEnd = pptx.addSlide();
  allSlides.push(sEnd);
  sEnd.background = { color: BG };
  sEnd.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: BLUE } });

  sEnd.addText('Thank You', {
    x: 0, y: 2.5, w: 13.33, h: 1,
    fontSize: 36, fontFace: 'Arial', color: TEXT, bold: true, align: 'center',
  });
  sEnd.addText('Davichi Finance Team Analysis Tool', {
    x: 0, y: 3.5, w: 13.33, h: 0.5,
    fontSize: 14, fontFace: 'Arial', color: SUB, align: 'center',
  });
  sEnd.addText(today, {
    x: 0, y: 4.1, w: 13.33, h: 0.4,
    fontSize: 11, fontFace: 'Arial', color: DIM, align: 'center',
  });

  // Add page numbers to all slides
  allSlides.forEach((slide, i) => {
    addSlideNumber(slide, i + 1, allSlides.length);
  });

  pptx.writeFile({ fileName: `analysis_${result.month1.label}_vs_${result.month2.label}.pptx` });
}
