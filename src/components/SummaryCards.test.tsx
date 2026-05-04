import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SummaryCards from './SummaryCards';
import type { AnalysisResult } from '../types';

function makeResult(overrides: Partial<AnalysisResult> = {}): AnalysisResult {
  return {
    month1: { label: '2026-01', total: 1_000_000, count: 10, months: ['2026-01'] },
    month2: { label: '2026-02', total: 1_500_000, count: 12, months: ['2026-02'] },
    totalDiff: 500_000,
    totalPctChange: 50,
    categoryComparison: [],
    vendorComparison: [],
    newItems: [],
    removedItems: [],
    increasedItems: [],
    decreasedItems: [],
    skippedRowCount: 0,
    skippedSummaryCount: 0,
    monthlyOnlyCategories: [],
    ...overrides,
  };
}

describe('SummaryCards', () => {
  it('renders both side labels and the diff sub-line', () => {
    render(<SummaryCards result={makeResult()} />);
    // formatMonthLabel converts 'YYYY-MM' → 'YYYY년 MM월'
    expect(screen.getByText('2026년 1월')).toBeInTheDocument();
    expect(screen.getByText('2026년 2월')).toBeInTheDocument();
    expect(screen.getByText(/\+50%/)).toBeInTheDocument();
  });

  it('shows the skippedRowCount warning only when > 0', () => {
    const { rerender } = render(<SummaryCards result={makeResult({ skippedRowCount: 0 })} />);
    expect(screen.queryByText(/날짜를 인식하지 못한/)).not.toBeInTheDocument();
    rerender(<SummaryCards result={makeResult({ skippedRowCount: 7 })} />);
    expect(screen.getByText(/날짜를 인식하지 못한/)).toBeInTheDocument();
    expect(screen.getByText(/7건/)).toBeInTheDocument();
  });

  it('shows 월계·누계 info when skippedSummaryCount > 0', () => {
    render(<SummaryCards result={makeResult({ skippedSummaryCount: 11 })} />);
    expect(screen.getByText(/월계·누계 행/)).toBeInTheDocument();
    expect(screen.getByText(/11건/)).toBeInTheDocument();
  });

  it('lists monthly-only categories when present', () => {
    render(<SummaryCards result={makeResult({
      monthlyOnlyCategories: ['복리후생비', '여비교통비'],
    })} />);
    expect(screen.getByText(/월계 행/)).toBeInTheDocument();
    expect(screen.getByText(/복리후생비, 여비교통비/)).toBeInTheDocument();
  });

  it('hides the 월계 info box when both signals are absent', () => {
    render(<SummaryCards result={makeResult()} />);
    expect(screen.queryByText(/월계·누계 행/)).not.toBeInTheDocument();
    expect(screen.queryByText(/월계 행/)).not.toBeInTheDocument();
  });
});
