import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('associates the label with the input', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Aceito os termos" />);

    const box = screen.getByRole('checkbox', { name: 'Aceito os termos' });
    expect(box).not.toBeChecked();

    // Clicking the text alone must toggle it — that is what the htmlFor buys.
    await user.click(screen.getByText('Aceito os termos'));
    expect(box).toBeChecked();
  });

  it('calls onChange when toggled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Opção" onChange={onChange} />);

    await user.click(screen.getByRole('checkbox'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('writes the indeterminate DOM property', () => {
    const { rerender } = render(<Checkbox label="Todos" indeterminate />);
    expect(screen.getByRole<HTMLInputElement>('checkbox').indeterminate).toBe(true);

    rerender(<Checkbox label="Todos" indeterminate={false} />);
    expect(screen.getByRole<HTMLInputElement>('checkbox').indeterminate).toBe(false);
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Opção" disabled />);

    await user.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('treats invalid as a shorthand for the critical role', () => {
    render(<Checkbox label="Obrigatório" invalid />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards a ref to the input', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Checkbox ref={ref} label="Opção" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
