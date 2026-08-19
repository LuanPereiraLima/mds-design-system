import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from '../Radio';

describe('Radio', () => {
  it('associates the label with the input', async () => {
    const user = userEvent.setup();
    render(<Radio name="p" label="Boleto" />);

    await user.click(screen.getByText('Boleto'));

    expect(screen.getByRole('radio', { name: 'Boleto' })).toBeChecked();
  });

  it('keeps a single choice within the same name', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Radio name="pagamento" value="pix" label="Pix" />
        <Radio name="pagamento" value="boleto" label="Boleto" />
      </>,
    );

    await user.click(screen.getByRole('radio', { name: 'Pix' }));
    await user.click(screen.getByRole('radio', { name: 'Boleto' }));

    expect(screen.getByRole('radio', { name: 'Pix' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Boleto' })).toBeChecked();
  });

  it('does not select when disabled', async () => {
    const user = userEvent.setup();
    render(<Radio name="p" label="Boleto" disabled />);

    await user.click(screen.getByRole('radio'));

    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('treats invalid as a shorthand for the critical role', () => {
    render(<Radio name="p" label="Obrigatório" invalid />);
    expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards a ref to the input', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Radio ref={ref} name="p" label="Opção" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
