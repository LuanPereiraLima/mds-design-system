import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropzone } from './Dropzone';

const meta = {
  title: 'Componentes/Entrada/Dropzone',
  component: Dropzone,
  parameters: { layout: 'centered' },
  args: {
    label: 'Arraste um arquivo ou clique para escolher',
    hint: 'PNG, JPG ou PDF até 10 MB',
    accept: 'image/png,image/jpeg,application/pdf',
    multiple: false,
    radius: 'default',
    invalid: false,
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    radius: { control: 'inline-radio', options: ['small', 'default', 'large', 'full'] },
    feedback: { control: 'inline-radio', options: ['success', 'caution', 'critical', 'info'] },
    onFilesSelected: { action: 'arquivos' },
  },
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Multiple: Story = {
  args: { multiple: true, label: 'Arraste seus documentos', hint: 'Você pode enviar vários de uma vez' },
};

export const WithoutHint: Story = { args: { hint: undefined } };

export const FeedbackStates: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))' }}>
      {(['success', 'caution', 'critical', 'info'] as const).map((feedback) => (
        <Dropzone key={feedback} {...args} feedback={feedback} hint={`estado ${feedback}`} />
      ))}
    </div>
  ),
};

export const Invalid: Story = {
  args: { invalid: true, hint: 'Formato não aceito' },
};

export const Disabled: Story = { args: { disabled: true } };
export const FullWidth: Story = { args: { fullWidth: true }, parameters: { layout: 'padded' } };

/** Com a lista do que foi escolhido — o componente só entrega os arquivos, a
 * exibição fica com quem usa. */
export const WithFileList: Story = {
  parameters: { layout: 'padded' },
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
        <Dropzone {...args} multiple fullWidth onFilesSelected={setFiles} />
        {files.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--on-background)' }}>
            {files.map((file) => (
              <li key={file.name}>
                {file.name} — {(file.size / 1024).toFixed(1)} kB
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
};
