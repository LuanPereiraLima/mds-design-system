import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputStepper } from '../InputStepper';

const spin = () => screen.getByRole('spinbutton');

describe('InputStepper', () => {
  it('increments and decrements by the step', async () => {
    const user = userEvent.setup();
    render(<InputStepper defaultValue={2} step={2} label="Qtd" />);

    await user.click(screen.getByRole('button', { name: 'Aumentar' }));
    expect(spin()).toHaveValue(4);

    await user.click(screen.getByRole('button', { name: 'Diminuir' }));
    expect(spin()).toHaveValue(2);
  });

  it('reports every change through onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InputStepper defaultValue={0} onValueChange={onValueChange} label="Qtd" />);

    await user.click(screen.getByRole('button', { name: 'Aumentar' }));

    expect(onValueChange).toHaveBeenCalledWith(1);
  });

  it('disables each button at its bound', () => {
    const { rerender } = render(<InputStepper value={0} min={0} max={3} label="Qtd" />);
    expect(screen.getByRole('button', { name: 'Diminuir' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Aumentar' })).toBeEnabled();

    rerender(<InputStepper value={3} min={0} max={3} label="Qtd" />);
    expect(screen.getByRole('button', { name: 'Aumentar' })).toBeDisabled();
  });

  it('clamps a typed value to the allowed range', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InputStepper defaultValue={1} min={0} max={5} onValueChange={onValueChange} label="Qtd" />);

    await user.type(spin(), '9');

    expect(onValueChange).toHaveBeenLastCalledWith(5);
  });

  it('stays put when controlled and the parent ignores the change', async () => {
    const user = userEvent.setup();
    render(<InputStepper value={2} label="Qtd" />);

    await user.click(screen.getByRole('button', { name: 'Aumentar' }));

    expect(spin()).toHaveValue(2);
  });

  it('disables the whole control', () => {
    render(<InputStepper defaultValue={1} disabled label="Qtd" />);

    expect(spin()).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Aumentar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Diminuir' })).toBeDisabled();
  });

  it('exposes the group with its accessible name', () => {
    render(<InputStepper defaultValue={1} label="Quantidade" />);
    expect(screen.getByRole('group', { name: 'Quantidade' })).toBeInTheDocument();
  });
});
