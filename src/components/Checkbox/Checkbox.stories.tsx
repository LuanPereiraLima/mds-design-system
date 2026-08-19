import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Componentes/Seleção/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  args: {
    label: 'Aceito os termos de uso',
    size: 'md',
    indeterminate: false,
    invalid: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    feedback: { control: 'inline-radio', options: ['success', 'caution', 'critical', 'info'] },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

/** O estado misto é só visual — quem usa decide o que ele significa. */
export const Indeterminate: Story = { args: { indeterminate: true } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Checkbox key={size} {...args} size={size} label={size} defaultChecked />
      ))}
    </div>
  ),
};

export const FeedbackStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['success', 'caution', 'critical', 'info'] as const).map((feedback) => (
        <Checkbox key={feedback} {...args} feedback={feedback} label={feedback} defaultChecked />
      ))}
    </div>
  ),
};

export const WithoutLabel: Story = { args: { label: undefined, 'aria-label': 'Selecionar' } };
export const Invalid: Story = { args: { invalid: true, label: 'Campo obrigatório' } };
export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox {...args} disabled label="Desabilitado" />
      <Checkbox {...args} disabled defaultChecked label="Desabilitado e marcado" />
    </div>
  ),
};

/** Um pai indeterminado governando a lista de filhos. */
export const ParentChild: Story = {
  render: (args) => {
    const [items, setItems] = useState([true, false, false]);
    const all = items.every(Boolean);
    const some = items.some(Boolean) && !all;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Checkbox
          {...args}
          label="Todos os documentos"
          checked={all}
          indeterminate={some}
          onChange={(event) => setItems(items.map(() => event.target.checked))}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 28 }}>
          {items.map((checked, index) => (
            <Checkbox
              key={index}
              size={args.size}
              label={`Documento ${index + 1}`}
              checked={checked}
              onChange={(event) =>
                setItems(items.map((v, i) => (i === index ? event.target.checked : v)))
              }
            />
          ))}
        </div>
      </div>
    );
  },
};
