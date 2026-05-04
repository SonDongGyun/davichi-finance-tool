import { describe, it, expect } from 'vitest';
import {
  extractMonths,
  analyzeSheets,
  analyzeMonthlyChanges,
  analyzeSheetComparison,
} from './analyzer';

const baseConfig = {
  dateColumn: 'date',
  amountColumns: { amount: 'amount' },
  categoryColumn: 'category',
  descriptionColumn: 'desc',
  vendorColumn: 'vendor',
};

function makeRow({ date, amount, category, vendor = '', desc = '' }) {
  return { date, amount, category, vendor, desc };
}

describe('extractMonths', () => {
  it('returns sorted, deduplicated month keys', () => {
    const rows = [
      makeRow({ date: '2025-03-15', amount: 1000, category: 'A' }),
      makeRow({ date: '2025-01-20', amount: 500, category: 'A' }),
      makeRow({ date: '2025-03-01', amount: 200, category: 'B' }),
    ];
    expect(extractMonths(rows, 'date')).toEqual(['2025-01', '2025-03']);
  });

  it('skips rows whose date does not parse', () => {
    const rows = [
      makeRow({ date: '2025-03-15', amount: 1000, category: 'A' }),
      makeRow({ date: 'not a date', amount: 500, category: 'A' }),
    ];
    expect(extractMonths(rows, 'date')).toEqual(['2025-03']);
  });

  it('returns empty when all rows fail to parse', () => {
    expect(extractMonths([{ date: 'x' }], 'date')).toEqual([]);
    expect(extractMonths([], 'date')).toEqual([]);
  });
});

describe('analyzeSheets', () => {
  it('infers a dominant year per sheet and sorts by year', () => {
    const rowsBySheet = {
      '2026': [
        makeRow({ date: '2026-01-01', amount: 100, category: 'X' }),
        makeRow({ date: '2026-02-01', amount: 100, category: 'X' }),
      ],
      '2024': [
        makeRow({ date: '2024-01-01', amount: 100, category: 'X' }),
      ],
    };
    const result = analyzeSheets(rowsBySheet, 'date');
    expect(result.map(s => s.year)).toEqual([2024, 2026]);
    expect(result[0].label).toBe('2024년');
    expect(result[1].months).toEqual(['2026-01', '2026-02']);
  });

  it('falls back to name sorting when year cannot be inferred', () => {
    const rowsBySheet = {
      'Sheet B': [makeRow({ date: 'invalid', amount: 100, category: 'X' })],
      'Sheet A': [makeRow({ date: 'invalid', amount: 100, category: 'X' })],
    };
    const result = analyzeSheets(rowsBySheet, 'date');
    expect(result.map(s => s.name)).toEqual(['Sheet A', 'Sheet B']);
    expect(result[0].label).toBe('Sheet A'); // no year → label = name
  });
});

describe('analyzeMonthlyChanges', () => {
  const rows = [
    // March
    makeRow({ date: '2025-03-01', amount: 1000, category: '식비', vendor: 'A상점' }),
    makeRow({ date: '2025-03-15', amount: 500, category: '교통비', vendor: '버스' }),
    // April
    makeRow({ date: '2025-04-01', amount: 1500, category: '식비', vendor: 'A상점' }),
    makeRow({ date: '2025-04-10', amount: 800, category: '교통비', vendor: '지하철' }),
    makeRow({ date: '2025-04-20', amount: 200, category: '간식', vendor: '편의점' }),
  ];

  it('produces totals, diff, and pct change for each side', () => {
    const result = analyzeMonthlyChanges(rows, {
      ...baseConfig,
      months1: ['2025-03'],
      months2: ['2025-04'],
    });
    expect(result.month1.total).toBe(1500);
    expect(result.month1.count).toBe(2);
    expect(result.month2.total).toBe(2500);
    expect(result.month2.count).toBe(3);
    expect(result.totalDiff).toBe(1000);
    expect(result.totalPctChange).toBeCloseTo(66.7, 1);
  });

  it('classifies category status correctly', () => {
    const result = analyzeMonthlyChanges(rows, {
      ...baseConfig,
      months1: ['2025-03'],
      months2: ['2025-04'],
    });
    const byCat = Object.fromEntries(result.categoryComparison.map(c => [c.category, c]));
    expect(byCat['식비'].status).toBe('increased');
    expect(byCat['식비'].diff).toBe(500);
    expect(byCat['교통비'].status).toBe('increased');
    expect(byCat['교통비'].diff).toBe(300);
    expect(byCat['간식'].status).toBe('new');
    expect(byCat['간식'].currAmount).toBe(200);
  });

  it('counts skipped rows once per pass even though sides share data', () => {
    const noisy = [
      ...rows,
      makeRow({ date: 'bad date', amount: 999, category: 'X' }),
      makeRow({ date: '', amount: 999, category: 'X' }),
    ];
    const result = analyzeMonthlyChanges(noisy, {
      ...baseConfig,
      months1: ['2025-03'],
      months2: ['2025-04'],
    });
    // Two unparseable rows; pre-fix this used to double to 4 because both
    // sides scanned the rows separately.
    expect(result.skippedRowCount).toBe(2);
  });
});

describe('analyzeMonthlyChanges - pctChange edge cases', () => {
  it('handles new categories (prev=0)', () => {
    const rows = [
      makeRow({ date: '2025-04-01', amount: 1000, category: 'NEW' }),
    ];
    const result = analyzeMonthlyChanges(rows, {
      ...baseConfig,
      months1: ['2025-03'],
      months2: ['2025-04'],
    });
    const cat = result.categoryComparison.find(c => c.category === 'NEW');
    expect(cat.status).toBe('new');
    expect(cat.pctChange).toBe(100);
  });

  it('handles negative-prev categories with absolute denominator', () => {
    // Refund-style category: -1000 → -500 is +50% (less negative), not 0/100.
    const rows = [
      makeRow({ date: '2025-03-01', amount: -1000, category: '환불' }),
      makeRow({ date: '2025-04-01', amount: -500, category: '환불' }),
    ];
    const result = analyzeMonthlyChanges(rows, {
      ...baseConfig,
      months1: ['2025-03'],
      months2: ['2025-04'],
    });
    const cat = result.categoryComparison.find(c => c.category === '환불');
    expect(cat.pctChange).toBeCloseTo(50, 1);
    expect(cat.status).toBe('increased'); // diff = 500 > 0
  });

  it('returns 0% when both totals are zero', () => {
    const result = analyzeMonthlyChanges([], {
      ...baseConfig,
      months1: ['2025-03'],
      months2: ['2025-04'],
    });
    expect(result.totalPctChange).toBe(0);
  });
});

describe('analyzeSheetComparison', () => {
  it('compares two pre-partitioned sheets independently', () => {
    const sheet1 = [
      makeRow({ date: '2024-03-01', amount: 1000, category: '식비' }),
      makeRow({ date: '2024-04-01', amount: 800, category: '교통비' }),
    ];
    const sheet2 = [
      makeRow({ date: '2025-03-01', amount: 1500, category: '식비' }),
      makeRow({ date: '2025-04-01', amount: 800, category: '교통비' }),
    ];
    const result = analyzeSheetComparison(
      sheet1, sheet2, baseConfig,
      ['2024-03', '2024-04'],
      ['2025-03', '2025-04'],
    );
    expect(result.month1.total).toBe(1800);
    expect(result.month2.total).toBe(2300);
    expect(result.totalDiff).toBe(500);
  });

  it('sums skipped rows across both sheets', () => {
    const sheet1 = [makeRow({ date: 'invalid', amount: 1, category: 'A' })];
    const sheet2 = [
      makeRow({ date: 'invalid', amount: 1, category: 'A' }),
      makeRow({ date: 'invalid', amount: 1, category: 'A' }),
    ];
    const result = analyzeSheetComparison(
      sheet1, sheet2, baseConfig,
      ['2024-01'], ['2025-01'],
    );
    expect(result.skippedRowCount).toBe(3);
  });
});

describe('debit/credit amount handling', () => {
  it('treats debit minus credit as the row amount', () => {
    const rows = [
      { date: '2025-03-01', debit: 1000, credit: 0, category: 'A' },
      { date: '2025-04-01', debit: 0, credit: 300, category: 'A' },
    ];
    const result = analyzeMonthlyChanges(rows, {
      ...baseConfig,
      amountColumns: { debit: 'debit', credit: 'credit' },
      months1: ['2025-03'],
      months2: ['2025-04'],
    });
    expect(result.month1.total).toBe(1000);
    expect(result.month2.total).toBe(-300);
    expect(result.totalDiff).toBe(-1300);
  });
});
