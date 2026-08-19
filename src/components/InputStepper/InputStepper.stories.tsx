import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InputStepper } from './InputStepper';

const meta = {
  title: 'Componentes/Entrada/Input Stepper',
  component: InputStepper,
  parameters: { layout: 'centered' },
  args: {
    defaultValue: 1,
    min: 0,
    max: 10,
    step: 1,
    size: 'md',
    radius: 'default',
    invalid: false,
    disabled: false,
    fullWidth: false,
    label: 'Quantidade',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    radius: { control: 'inline-radio', options: ['small', 'default', 'large', 'full'] },
    feedback: { control: 'inline-radio', options: ['success', 'caution', 'critical', 'info'] },
    onValueChange: { action: 'changed' },
  },
} satisfies Meta<typeof InputStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Os botões desabilitam sozinhos ao encostar nos limites. */
export const AtBounds: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <InputStepper {...args} defaultValue={0} />
      <InputStepper {...args} defaultValue={10} />
    </div>
  ),
};

export const CustomStep: Story = { args: { step: 5, max: 50, defaultValue: 10 } };

/** Sem `min`/`max`, aceita qualquer inteiro, inclusive negativos. */
export const Unbounded: Story = {
  args: { min: undefined, max: undefined, defaultValue: 0 },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <InputStepper key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
export const FullWidth: Story = { args: { fullWidth: true }, parameters: { layout: 'padded' } };

/** Controlado: o valor vive fora e volta pelo `onValueChange`. */
export const Controlled: Story = {
  render: (args) => {
    const [qty, setQty] = useState(2);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <InputStepper {...args} value={qty} onValueChange={setQty} />
        <code style={{ fontSize: 13, color: 'var(--subtle-on-background)' }}>valor: {qty}</code>
      </div>
    );
  },
};
