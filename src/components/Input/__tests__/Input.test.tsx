import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with a placeholder', () => {
    render(<Input placeholder="Nome" />);
    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
  });

  it('accepts typed text', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input placeholder="Nome" onChange={onChange} />);

    await user.type(screen.getByPlaceholderText('Nome'), 'abc');

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(screen.getByPlaceholderText<HTMLInputElement>('Nome').value).toBe('abc');
  });

  it('does not accept input when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input placeholder="Nome" disabled onChange={onChange} />);

    const input = screen.getByPlaceholderText('Nome');
    expect(input).toBeDisabled();

    await user.type(input, 'abc');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('exposes aria-invalid when invalid', () => {
    render(<Input placeholder="Nome" invalid />);
    expect(screen.getByPlaceholderText('Nome')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('does not set aria-invalid by default', () => {
    render(<Input placeholder="Nome" />);
    expect(screen.getByPlaceholderText('Nome')).not.toHaveAttribute('aria-invalid');
  });

  it('forwards the type attribute', () => {
    render(<Input placeholder="Senha" type="password" />);
    expect(screen.getByPlaceholderText('Senha')).toHaveAttribute(
      'type',
      'password',
    );
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} placeholder="Ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('does not leak transient style props to the DOM', () => {
    render(<Input placeholder="Styled" radius="full" size="lg" invalid fullWidth />);

    const input = screen.getByPlaceholderText('Styled');
    expect(input).not.toHaveAttribute('radius');
    expect(input).not.toHaveAttribute('fullWidth');
    expect(input).not.toHaveAttribute('$radius');
    expect(input).not.toHaveAttribute('$size');
  });

  it('applies the feedback role as a data attribute', () => {
    render(<Input placeholder="E-mail" feedback="success" />);
    expect(screen.getByPlaceholderText('E-mail')).toHaveAttribute('data-feedback', 'success');
  });

  it('treats invalid as a shorthand for the critical role', () => {
    render(<Input placeholder="CPF" invalid />);

    const input = screen.getByPlaceholderText('CPF');
    expect(input).toHaveAttribute('data-feedback', 'critical');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('lets an explicit feedback role win over invalid', () => {
    render(<Input placeholder="Senha" invalid feedback="caution" />);
    expect(screen.getByPlaceholderText('Senha')).toHaveAttribute('data-feedback', 'caution');
  });
});
