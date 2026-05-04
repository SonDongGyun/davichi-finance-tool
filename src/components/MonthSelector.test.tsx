import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MonthSelector from './MonthSelector';
import type { DateRange } from '../types';
import type { MonthlyMode } from '../state/appReducer';

interface SetupOverrides {
  months?: string[];
  mode?: MonthlyMode;
  range1?: DateRange;
  range2?: DateRange;
}

function setup(overrides: SetupOverrides = {}) {
  const props = {
    months: ['2025-01', '2025-02', '2025-03'],
    mode: 'single' as MonthlyMode,
    onModeChange: vi.fn(),
    range1: { start: '', end: '' },
    range2: { start: '', end: '' },
    onRange1Change: vi.fn(),
    onRange2Change: vi.fn(),
    onAnalyze: vi.fn(),
    ...overrides,
  };
  const utils = render(<MonthSelector {...props} />);
  return { ...utils, props };
}

describe('MonthSelector', () => {
  it('disables analyze button until both ranges are selected', () => {
    setup();
    const btn = screen.getByRole('button', { name: /선택해주세요/ });
    expect(btn).toBeDisabled();
  });

  it('disables analyze when both sides reference the same month (single mode)', () => {
    setup({
      range1: { start: '2025-01', end: '2025-01' },
      range2: { start: '2025-01', end: '2025-01' },
    });
    const btn = screen.getByRole('button', { name: /선택해주세요/ });
    expect(btn).toBeDisabled();
  });

  it('enables analyze when both sides have distinct months', async () => {
    const user = userEvent.setup();
    const { props } = setup({
      range1: { start: '2025-01', end: '2025-01' },
      range2: { start: '2025-02', end: '2025-02' },
    });
    const btn = screen.getByRole('button', { name: '분석 시작' });
    expect(btn).toBeEnabled();
    await user.click(btn);
    expect(props.onAnalyze).toHaveBeenCalledTimes(1);
  });

  it('switches to range mode when 기간 비교 toggle is clicked', async () => {
    const user = userEvent.setup();
    const { props } = setup();
    await user.click(screen.getByText('기간 비교'));
    expect(props.onModeChange).toHaveBeenCalledWith('range');
  });
});
