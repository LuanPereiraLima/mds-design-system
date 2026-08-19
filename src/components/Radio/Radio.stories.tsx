import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta = {
  title: 'Componentes/Seleção/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  args: {
    label: 'Boleto bancário',
    name: 'pagamento',
    size: 'md',
    invalid: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    feedback: { control: 'inline-radio', options: ['success', 'caution', 'critical', 'info'] },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

/** Radios do mesmo `name` formam um grupo — o navegador cuida da exclusão
 * mútua e da navegação por setas. */
export const Group: Story = {
  render: (args) => {
    const [value, setValue] = useState('boleto');
    return (
      <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {['boleto', 'pix', 'cartão'].map((option) => (
          <Radio
            key={option}
            {...args}
            name="pagamento-grupo"
            value={option}
            label={option}
            checked={value === option}
            onChange={() => setValue(option)}
          />
        ))}
      </fieldset>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Radio key={size} {...args} name={`s-${size}`} size={size} label={size} defaultChecked />
      ))}
    </div>
  ),
};

export const FeedbackStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['success', 'caution', 'critical', 'info'] as const).map((feedback) => (
        <Radio
          key={feedback}
          {...args}
          name={`f-${feedback}`}
          feedback={feedback}
          label={feedback}
          defaultChecked
        />
      ))}
    </div>
  ),
};

export const Invalid: Story = { args: { invalid: true, label: 'Escolha obrigatória' } };
export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Radio {...args} name="d1" disabled label="Desabilitado" />
      <Radio {...args} name="d2" disabled defaultChecked label="Desabilitado e marcado" />
    </div>
  ),
};
