import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Selector } from './Selector';

const PixIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="m12 3 9 9-9 9-9-9 9-9Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const meta = {
  title: 'Componentes/Seleção/Selector',
  component: Selector,
  parameters: { layout: 'centered' },
  args: {
    label: 'Pix',
    description: 'Aprovação na hora, sem taxa',
    mode: 'single',
    name: 'pagamento',
    radius: 'default',
    invalid: false,
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'multiple'] },
    radius: { control: 'inline-radio', options: ['small', 'default', 'large', 'full'] },
    feedback: { control: 'inline-radio', options: ['success', 'caution', 'critical', 'info'] },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Selector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = { args: { defaultChecked: true } };

export const WithIcon: Story = { args: { icon: <PixIcon />, defaultChecked: true } };

export const WithoutDescription: Story = { args: { description: undefined } };

/** `single` renderiza um radio: escolher um limpa os outros. */
export const SingleChoice: Story = {
  parameters: { layout: 'padded' },
  render: (args) => {
    const [value, setValue] = useState('pix');
    const options = [
      { value: 'pix', label: 'Pix', description: 'Aprovação na hora, sem taxa' },
      { value: 'boleto', label: 'Boleto', description: 'Compensa em até 3 dias úteis' },
      { value: 'cartao', label: 'Cartão de crédito', description: 'Em até 12x' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
        {options.map((option) => (
          <Selector
            {...args}
            key={option.value}
            mode="single"
            name="pagamento-single"
            fullWidth
            value={option.value}
            label={option.label}
            description={option.description}
            checked={value === option.value}
            onChange={() => setValue(option.value)}
          />
        ))}
      </div>
    );
  },
};

/** `multiple` renderiza um checkbox: dá para marcar quantos quiser. */
export const MultipleChoice: Story = {
  parameters: { layout: 'padded' },
  render: (args) => {
    const [picked, setPicked] = useState<string[]>(['obra']);
    const options = [
      { value: 'obra', label: 'Andamento da obra' },
      { value: 'financeiro', label: 'Financeiro' },
      { value: 'documentos', label: 'Documentos' },
    ];
    const toggle = (value: string) =>
      setPicked((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
        {options.map((option) => (
          <Selector
            {...args}
            key={option.value}
            mode="multiple"
            name="avisos"
            fullWidth
            description={undefined}
            value={option.value}
            label={option.label}
            checked={picked.includes(option.value)}
            onChange={() => toggle(option.value)}
          />
        ))}
      </div>
    );
  },
};

export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
export const FullWidth: Story = { args: { fullWidth: true }, parameters: { layout: 'padded' } };
