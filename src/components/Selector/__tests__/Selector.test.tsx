import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Selector } from '../Selector';

describe('Selector', () => {
  it('renders a radio in single mode', () => {
    render(<Selector name="p" label="Pix" mode="single" />);
    expect(screen.getByRole('radio', { name: /Pix/ })).toBeInTheDocument();
  });

  it('renders a checkbox in multiple mode', () => {
    render(<Selector name="p" label="Pix" mode="multiple" />);
    expect(screen.getByRole('checkbox', { name: /Pix/ })).toBeInTheDocument();
  });

  it('selects when the card is clicked, not just the control', async () => {
    const user = userEvent.setup();
    render(<Selector name="p" label="Pix" description="Sem taxa" />);

    // The description is the far end of the card — clicking it must still select.
    await user.click(screen.getByText('Sem taxa'));

    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('includes the description in the accessible name', () => {
    render(<Selector name="p" label="Pix" description="Aprovação na hora" />);
    expect(screen.getByRole('radio', { name: /Aprovação na hora/ })).toBeInTheDocument();
  });

  it('calls onChange when picked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Selector name="p" label="Pix" onChange={onChange} />);

    await user.click(screen.getByRole('radio'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('does not select when disabled', async () => {
    const user = userEvent.setup();
    render(<Selector name="p" label="Pix" disabled />);

    await user.click(screen.getByRole('radio'));

    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('forwards a ref to the input', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Selector ref={ref} name="p" label="Pix" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
