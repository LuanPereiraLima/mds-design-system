import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputCode } from '../InputCode';

const boxes = () => screen.getAllByRole('textbox');

describe('InputCode', () => {
  it('renders one box per character', () => {
    render(<InputCode length={4} label="Código" />);
    expect(boxes()).toHaveLength(4);
  });

  it('advances to the next box as you type', async () => {
    const user = userEvent.setup();
    render(<InputCode length={4} label="Código" />);

    await user.click(boxes()[0]);
    await user.keyboard('12');

    expect(boxes()[0]).toHaveValue('1');
    expect(boxes()[1]).toHaveValue('2');
    expect(boxes()[2]).toHaveFocus();
  });

  it('ignores letters while numeric', async () => {
    const user = userEvent.setup();
    render(<InputCode length={4} label="Código" />);

    await user.click(boxes()[0]);
    await user.keyboard('a');

    expect(boxes()[0]).toHaveValue('');
  });

  it('accepts letters once numeric is off', async () => {
    const user = userEvent.setup();
    render(<InputCode length={4} numeric={false} label="Código" />);

    await user.click(boxes()[0]);
    await user.keyboard('a');

    expect(boxes()[0]).toHaveValue('a');
  });

  it('walks back on backspace, clearing as it goes', async () => {
    const user = userEvent.setup();
    render(<InputCode length={4} defaultValue="12" label="Código" />);

    await user.click(boxes()[2]);
    await user.keyboard('{Backspace}');

    expect(boxes()[1]).toHaveValue('');
    expect(boxes()[1]).toHaveFocus();
  });

  it('spreads a pasted code across the boxes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InputCode length={6} onValueChange={onValueChange} label="Código" />);

    await user.click(boxes()[0]);
    await user.paste('123456');

    expect(onValueChange).toHaveBeenLastCalledWith('123456');
    expect(boxes()[5]).toHaveValue('6');
  });

  it('fires onComplete once the last box is filled', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<InputCode length={3} defaultValue="12" onComplete={onComplete} label="Código" />);

    await user.click(boxes()[2]);
    await user.keyboard('3');

    expect(onComplete).toHaveBeenCalledWith('123');
  });

  it('moves between boxes with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<InputCode length={4} label="Código" />);

    await user.click(boxes()[2]);
    await user.keyboard('{ArrowLeft}');
    expect(boxes()[1]).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(boxes()[2]).toHaveFocus();
  });

  it('exposes the group with its accessible name', () => {
    render(<InputCode length={3} label="Código de verificação" />);
    expect(screen.getByRole('group', { name: 'Código de verificação' })).toBeInTheDocument();
  });
});
