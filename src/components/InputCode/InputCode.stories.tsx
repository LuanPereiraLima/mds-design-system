import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InputCode } from './InputCode';

const meta = {
  title: 'Componentes/Entrada/Input Code',
  component: InputCode,
  parameters: { layout: 'centered' },
  args: {
    length: 6,
    numeric: true,
    size: 'md',
    radius: 'default',
    invalid: false,
    disabled: false,
    label: 'Código de verificação',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    radius: { control: 'inline-radio', options: ['small', 'default', 'large', 'full'] },
    feedback: { control: 'inline-radio', options: ['success', 'caution', 'critical', 'info'] },
    length: { control: { type: 'number', min: 3, max: 8 } },
    onValueChange: { action: 'changed' },
    onComplete: { action: 'completo' },
  },
} satisfies Meta<typeof InputCode>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Digite para avançar sozinho, Backspace para voltar, e cole um código
 * inteiro para distribuir entre as casas. */
export const Playground: Story = {};

export const Filled: Story = { args: { defaultValue: '123456' } };

export const FourDigits: Story = { args: { length: 4, defaultValue: '42' } };

/** Com `numeric` desligado, aceita letras — útil para códigos alfanuméricos. */
export const Alphanumeric: Story = {
  args: { numeric: false, defaultValue: 'MRV' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <InputCode key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Invalid: Story = { args: { invalid: true, defaultValue: '000000' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: '123456' } };

/** Controlado: o valor vive fora e volta pelo `onValueChange`. */
export const Controlled: Story = {
  render: (args) => {
    const [code, setCode] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <InputCode {...args} value={code} onValueChange={setCode} />
        <code style={{ fontSize: 13, color: 'var(--subtle-on-background)' }}>
          valor: "{code}" ({code.length}/{args.length ?? 6})
        </code>
      </div>
    );
  },
};
