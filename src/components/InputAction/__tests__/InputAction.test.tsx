import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputAction } from '../InputAction';

const icon = <span data-testid="icon" />;

describe('InputAction', () => {
  it('renders the field and the trailing button', () => {
    render(<InputAction placeholder="Buscar" icon={icon} actionLabel="Buscar" />);

    expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onAction when the button is pressed', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<InputAction placeholder="Buscar" icon={icon} actionLabel="Buscar" onAction={onAction} />);

    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('is a plain button, so it never submits a surrounding form', () => {
    render(<InputAction placeholder="Buscar" icon={icon} actionLabel="Buscar" />);
    expect(screen.getByRole('button', { name: 'Buscar' })).toHaveAttribute('type', 'button');
  });

  it('can disable the action alone, leaving the field editable', async () => {
    const user = userEvent.setup();
    render(<InputAction placeholder="Buscar" icon={icon} actionLabel="Buscar" actionDisabled />);

    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();

    await user.type(screen.getByPlaceholderText('Buscar'), 'abc');
    expect(screen.getByPlaceholderText<HTMLInputElement>('Buscar').value).toBe('abc');
  });

  it('disables the action when the whole field is disabled', () => {
    render(<InputAction placeholder="Buscar" icon={icon} actionLabel="Buscar" disabled />);

    expect(screen.getByPlaceholderText('Buscar')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
  });

  it('forwards a ref to the field', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<InputAction ref={ref} placeholder="Buscar" icon={icon} actionLabel="Buscar" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
