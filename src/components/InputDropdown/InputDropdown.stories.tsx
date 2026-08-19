import type { Meta, StoryObj } from '@storybook/react';
import { InputDropdown } from './InputDropdown';

const TORRES = [
  { value: 'a', label: 'Torre A' },
  { value: 'b', label: 'Torre B' },
  { value: 'c', label: 'Torre C — em obras', disabled: true },
  { value: 'd', label: 'Torre D' },
];

const meta = {
  title: 'Componentes/Entrada/Input Dropdown',
  component: InputDropdown,
  parameters: { layout: 'centered' },
  args: {
    options: TORRES,
    placeholder: 'Selecione a torre',
    radius: 'default',
    size: 'md',
    invalid: false,
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    radius: { control: 'inline-radio', options: ['small', 'default', 'large', 'full'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    feedback: { control: 'inline-radio', options: ['success', 'caution', 'critical', 'info'] },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof InputDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Sem `placeholder`, o campo já abre na primeira opção. */
export const WithoutPlaceholder: Story = {
  args: { placeholder: undefined, defaultValue: 'b' },
};

/** Opções podem ser desabilitadas individualmente (veja "Torre C"). */
export const DisabledOption: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <InputDropdown key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const FeedbackStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['success', 'caution', 'critical', 'info'] as const).map((feedback) => (
        <InputDropdown key={feedback} {...args} feedback={feedback} defaultValue="a" />
      ))}
    </div>
  ),
};

export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'a' } };
export const FullWidth: Story = { args: { fullWidth: true }, parameters: { layout: 'padded' } };
