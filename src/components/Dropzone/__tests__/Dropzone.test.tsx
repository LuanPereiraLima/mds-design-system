import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropzone } from '../Dropzone';

const file = (name: string) => new File(['conteudo'], name, { type: 'text/plain' });

describe('Dropzone', () => {
  it('renders its label and hint', () => {
    render(<Dropzone label="Solte aqui" hint="PDF até 10 MB" />);

    expect(screen.getByText('Solte aqui')).toBeInTheDocument();
    expect(screen.getByText('PDF até 10 MB')).toBeInTheDocument();
  });

  it('is a button, so it works by keyboard', () => {
    render(<Dropzone label="Solte aqui" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('reports files chosen through the picker', async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();
    const { container } = render(<Dropzone label="Solte aqui" onFilesSelected={onFilesSelected} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file('contrato.txt'));

    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    expect(onFilesSelected.mock.calls[0][0][0].name).toBe('contrato.txt');
  });

  it('reports dropped files', () => {
    const onFilesSelected = vi.fn();
    render(<Dropzone label="Solte aqui" onFilesSelected={onFilesSelected} />);

    fireEvent.drop(screen.getByRole('button'), {
      dataTransfer: { files: [file('planta.pdf')] },
    });

    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    expect(onFilesSelected.mock.calls[0][0][0].name).toBe('planta.pdf');
  });

  it('ignores drops when disabled', () => {
    const onFilesSelected = vi.fn();
    render(<Dropzone label="Solte aqui" disabled onFilesSelected={onFilesSelected} />);

    fireEvent.drop(screen.getByRole('button'), {
      dataTransfer: { files: [file('planta.pdf')] },
    });

    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it('ignores an empty drop', () => {
    const onFilesSelected = vi.fn();
    render(<Dropzone label="Solte aqui" onFilesSelected={onFilesSelected} />);

    fireEvent.drop(screen.getByRole('button'), { dataTransfer: { files: [] } });

    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it('keeps the file input in the DOM for plain form posts', () => {
    const { container } = render(<Dropzone label="Solte aqui" name="anexo" accept=".pdf" multiple />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'anexo');
    expect(input).toHaveAttribute('accept', '.pdf');
    expect(input.multiple).toBe(true);
  });
});
