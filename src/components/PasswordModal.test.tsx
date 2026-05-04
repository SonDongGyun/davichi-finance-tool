import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordModal from './PasswordModal';

interface SetupOverrides {
  isOpen?: boolean;
  error?: string;
  isLoading?: boolean;
}

function setup(overrides: SetupOverrides = {}) {
  const props = {
    isOpen: true,
    onSubmit: vi.fn(),
    onClose: vi.fn(),
    error: '',
    isLoading: false,
    ...overrides,
  };
  const utils = render(<PasswordModal {...props} />);
  return { ...utils, props };
}

describe('PasswordModal', () => {
  it('does not render when closed', () => {
    setup({ isOpen: false });
    expect(screen.queryByLabelText('파일 암호')).not.toBeInTheDocument();
  });

  it('renders password input when open and focuses it', () => {
    setup();
    expect(screen.getByLabelText('파일 암호')).toBeInTheDocument();
  });

  it('disables submit until password has content', async () => {
    const user = userEvent.setup();
    setup();
    const submit = screen.getByRole('button', { name: '암호 확인 및 파일 열기' });
    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText('파일 암호'), 'pw');
    expect(submit).toBeEnabled();
  });

  it('fires onSubmit with the entered password', async () => {
    const user = userEvent.setup();
    const { props } = setup();
    await user.type(screen.getByLabelText('파일 암호'), 'secret');
    await user.click(screen.getByRole('button', { name: '암호 확인 및 파일 열기' }));
    expect(props.onSubmit).toHaveBeenCalledWith('secret');
  });

  it('shows the error message when provided', () => {
    setup({ error: '암호가 올바르지 않습니다.' });
    expect(screen.getByText('암호가 올바르지 않습니다.')).toBeInTheDocument();
  });

  it('shows loading state and disables submit while loading', () => {
    setup({ isLoading: true });
    const submit = screen.getByRole('button', { name: /복호화 중/ });
    expect(submit).toBeDisabled();
  });

  it('fires onClose when 닫기 is clicked', async () => {
    const user = userEvent.setup();
    const { props } = setup();
    await user.click(screen.getByLabelText('닫기'));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
