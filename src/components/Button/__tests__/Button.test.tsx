import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);

    await user.click(screen.getByRole('button', { name: 'Click' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Click
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Click' });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
      'type',
      'submit',
    );
  });

  it('forwards a ref to the underlying button element', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('does not leak transient style props to the DOM', () => {
    render(
      <Button
        variant="secondary"
        appearance="outlined"
        size="lg"
        tone="inverse"
        radius="full"
        fullWidth
      >
        Styled
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Styled' });
    expect(button).not.toHaveAttribute('variant');
    expect(button).not.toHaveAttribute('appearance');
    expect(button).not.toHaveAttribute('size');
    expect(button).not.toHaveAttribute('fullWidth');
    expect(button).not.toHaveAttribute('tone');
    expect(button).not.toHaveAttribute('radius');
    expect(button).not.toHaveAttribute('$variant');
  });

  it('sets data-feedback only for the feedback intent', () => {
    const { rerender } = render(
      <Button intent="feedback" feedback="critical">
        Excluir
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Excluir' })).toHaveAttribute(
      'data-feedback',
      'critical',
    );

    rerender(<Button intent="brand">Excluir</Button>);
    expect(screen.getByRole('button', { name: 'Excluir' })).not.toHaveAttribute('data-feedback');
  });

  it('marks itself busy while loading, without becoming disabled', () => {
    render(<Button loading>Enviando</Button>);

    const button = screen.getByRole('button', { name: 'Enviando' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    // `disabled` would swap in the disabled colors instead of the loading ones.
    expect(button).not.toBeDisabled();
  });

  it('renders start and end icons around the label', () => {
    render(
      <Button startIcon={<span data-testid="start" />} endIcon={<span data-testid="end" />}>
        Label
      </Button>,
    );

    expect(screen.getByTestId('start')).toBeInTheDocument();
    expect(screen.getByTestId('end')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument();
  });
});
