import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StepHelper } from '../StepHelper';

const STEPS = [
  { label: 'Dados' },
  { label: 'Documentos', description: 'Envie os comprovantes' },
  { label: 'Revisão' },
];

describe('StepHelper', () => {
  it('renders the steps as an ordered list', () => {
    render(<StepHelper steps={STEPS} label="Progresso" />);

    expect(screen.getByRole('list', { name: 'Progresso' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders labels and descriptions', () => {
    render(<StepHelper steps={STEPS} />);

    expect(screen.getByText('Documentos')).toBeInTheDocument();
    expect(screen.getByText('Envie os comprovantes')).toBeInTheDocument();
  });

  it('marks the current step with aria-current', () => {
    render(<StepHelper steps={STEPS} current={1} />);

    const items = screen.getAllByRole('listitem');
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).not.toHaveAttribute('aria-current');
  });

  it('numbers upcoming steps and ticks off completed ones', () => {
    render(<StepHelper steps={STEPS} current={1} />);

    // Step 1 is done, so its number is replaced by the check icon.
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders no buttons without onStepClick', () => {
    render(<StepHelper steps={STEPS} current={2} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('makes only reachable steps activatable', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<StepHelper steps={STEPS} current={1} onStepClick={onStepClick} />);

    // Completed + current are buttons; the upcoming one is not.
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    await user.click(buttons[0]);
    expect(onStepClick).toHaveBeenCalledWith(0);
  });

  it('shows every step as completed once current passes the end', () => {
    render(<StepHelper steps={STEPS} current={STEPS.length} />);

    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });
});
