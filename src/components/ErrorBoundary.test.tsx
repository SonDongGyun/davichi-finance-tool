import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

function Throw({ message }: { message: string }): never {
  throw new Error(message);
}

describe('ErrorBoundary', () => {
  // Suppress React's expected console.error spam from boundary tests so the
  // test output stays focused on real failures.
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <p>safe content</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('safe content')).toBeInTheDocument();
  });

  it('renders the friendly fallback when a child throws', () => {
    render(
      <ErrorBoundary>
        <Throw message="boom" />
      </ErrorBoundary>,
    );
    expect(screen.getByText('예기치 않은 오류가 발생했습니다')).toBeInTheDocument();
    // Both action buttons should be available.
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /페이지 새로고침/ })).toBeInTheDocument();
  });

  it('re-renders children after 다시 시도 if the throw was transient', async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    function Child() {
      if (shouldThrow) throw new Error('first time');
      return <p>recovered</p>;
    }

    render(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>,
    );
    expect(screen.getByText('예기치 않은 오류가 발생했습니다')).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(screen.getByText('recovered')).toBeInTheDocument();
  });
});
