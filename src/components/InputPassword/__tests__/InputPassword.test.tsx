import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputPassword } from '../InputPassword';

describe('InputPassword', () => {
  it('starts hidden', () => {
    render(<InputPassword placeholder="Senha" />);
    expect(screen.getByPlaceholderText('Senha')).toHaveAttribute('type', 'password');
  });

  it('reveals and hides the value through the toggle', async () => {
    const user = userEvent.setup();
    render(<InputPassword placeholder="Senha" />);

    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(screen.getByPlaceholderText('Senha')).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Ocultar senha' }));
    expect(screen.getByPlaceholderText('Senha')).toHaveAttribute('type', 'password');
  });

  it('can start revealed', () => {
    render(<InputPassword placeholder="Senha" defaultVisible />);

    expect(screen.getByPlaceholderText('Senha')).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeInTheDocument();
  });

  it('accepts custom toggle labels', () => {
    render(<InputPassword placeholder="Senha" showLabel="Reveal" hideLabel="Hide" />);
    expect(screen.getByRole('button', { name: 'Reveal' })).toBeInTheDocument();
  });

  it('keeps the typed value when toggling visibility', async () => {
    const user = userEvent.setup();
    render(<InputPassword placeholder="Senha" />);

    await user.type(screen.getByPlaceholderText('Senha'), 'segredo');
    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }));

    expect(screen.getByPlaceholderText<HTMLInputElement>('Senha').value).toBe('segredo');
  });
});
