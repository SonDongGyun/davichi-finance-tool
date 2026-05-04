import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingPage from './LandingPage';
import { MODE_MONTHLY, MODE_SHEET } from '../constants/steps';

describe('LandingPage', () => {
  it('renders both mode cards with title and example', () => {
    render(<LandingPage onSelectMode={vi.fn()} />);
    expect(screen.getByText('월별 비교')).toBeInTheDocument();
    expect(screen.getByText('시트별 비교')).toBeInTheDocument();
    // Examples differentiate the two cards in case the title is renamed.
    expect(screen.getByText(/2025년 3월 vs 2025년 4월/)).toBeInTheDocument();
    expect(screen.getByText(/2025년 1~2월 vs 2026년 1~2월/)).toBeInTheDocument();
  });

  it('passes the chosen mode key to onSelectMode (monthly)', async () => {
    const user = userEvent.setup();
    const onSelectMode = vi.fn();
    render(<LandingPage onSelectMode={onSelectMode} />);
    await user.click(screen.getByText('월별 비교'));
    expect(onSelectMode).toHaveBeenCalledWith(MODE_MONTHLY);
  });

  it('passes the chosen mode key to onSelectMode (sheet)', async () => {
    const user = userEvent.setup();
    const onSelectMode = vi.fn();
    render(<LandingPage onSelectMode={onSelectMode} />);
    await user.click(screen.getByText('시트별 비교'));
    expect(onSelectMode).toHaveBeenCalledWith(MODE_SHEET);
  });
});
