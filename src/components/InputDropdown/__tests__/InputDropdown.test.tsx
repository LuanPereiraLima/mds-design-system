import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputDropdown } from '../InputDropdown';

const OPTIONS = [
  { value: 'a', label: 'Torre A' },
  { value: 'b', label: 'Torre B' },
  { value: 'c', label: 'Torre C', disabled: true },
];

describe('InputDropdown', () => {
  it('renders the options it is given', () => {
    render(<InputDropdown options={OPTIONS} aria-label="Torre" />);

    expect(screen.getByRole('option', { name: 'Torre A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Torre C' })).toBeDisabled();
  });

  it('selects a value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InputDropdown options={OPTIONS} aria-label="Torre" onChange={onChange} />);

    await user.selectOptions(screen.getByRole('combobox'), 'b');

    expect(screen.getByRole<HTMLSelectElement>('combobox').value).toBe('b');
    expect(onChange).toHaveBeenCalled();
  });

  it('starts on the placeholder, which cannot be chosen', () => {
    render(<InputDropdown options={OPTIONS} placeholder="Selecione" aria-label="Torre" />);

    expect(screen.getByRole<HTMLSelectElement>('combobox').value).toBe('');
    expect(screen.getByRole('option', { name: 'Selecione' })).toBeDisabled();
  });

  it('accepts custom children instead of options', () => {
    render(
      <InputDropdown aria-label="Torre">
        <option value="x">Personalizada</option>
      </InputDropdown>,
    );
    expect(screen.getByRole('option', { name: 'Personalizada' })).toBeInTheDocument();
  });

  it('treats invalid as a shorthand for the critical role', () => {
    render(<InputDropdown options={OPTIONS} invalid aria-label="Torre" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards a ref and does not leak transient props', () => {
    const ref = { current: null as HTMLSelectElement | null };
    render(<InputDropdown ref={ref} options={OPTIONS} size="lg" radius="full" aria-label="Torre" />);

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    expect(screen.getByRole('combobox')).not.toHaveAttribute('radius');
  });
});
