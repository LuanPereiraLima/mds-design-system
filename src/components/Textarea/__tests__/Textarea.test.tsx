import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../Textarea';

describe('Textarea', () => {
  it('renders with a placeholder', () => {
    render(<Textarea placeholder="Mensagem" />);
    expect(screen.getByPlaceholderText('Mensagem')).toBeInTheDocument();
  });

  it('accepts typed text', async () => {
    const user = userEvent.setup();
    render(<Textarea placeholder="Mensagem" />);

    await user.type(screen.getByPlaceholderText('Mensagem'), 'oi');

    expect(screen.getByPlaceholderText<HTMLTextAreaElement>('Mensagem').value).toBe('oi');
  });

  it('does not accept input when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea placeholder="Mensagem" disabled onChange={onChange} />);

    await user.type(screen.getByPlaceholderText('Mensagem'), 'oi');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('treats invalid as a shorthand for the critical role', () => {
    render(<Textarea placeholder="Mensagem" invalid />);

    const field = screen.getByPlaceholderText('Mensagem');
    expect(field).toHaveAttribute('data-feedback', 'critical');
    expect(field).toHaveAttribute('aria-invalid', 'true');
  });

  it('lets an explicit feedback role win over invalid', () => {
    render(<Textarea placeholder="Mensagem" invalid feedback="caution" />);
    expect(screen.getByPlaceholderText('Mensagem')).toHaveAttribute('data-feedback', 'caution');
  });

  it('forwards a ref and does not leak transient props', () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea ref={ref} placeholder="Mensagem" size="lg" radius="full" resize="none" />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    const field = screen.getByPlaceholderText('Mensagem');
    expect(field).not.toHaveAttribute('size');
    expect(field).not.toHaveAttribute('radius');
    expect(field).not.toHaveAttribute('resize');
  });
});
