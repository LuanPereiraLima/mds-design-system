import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta = {
  title: 'Componentes/Entrada/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  args: {
    placeholder: 'Escreva sua mensagem...',
    radius: 'default',
    size: 'md',
    resize: 'vertical',
    rows: 4,
    invalid: false,
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    radius: { control: 'inline-radio', options: ['small', 'default', 'large', 'full'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    feedback: { control: 'inline-radio', options: ['success', 'caution', 'critical', 'info'] },
    resize: { control: 'inline-radio', options: ['none', 'vertical', 'both'] },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'O acabamento do apartamento superou a expectativa.' },
};

export const FeedbackStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['success', 'caution', 'critical', 'info'] as const).map((feedback) => (
        <Textarea key={feedback} {...args} feedback={feedback} defaultValue={`estado ${feedback}`} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Textarea key={size} {...args} size={size} placeholder={size} />
      ))}
    </div>
  ),
};

/** `resize` controla em quais direções o usuário pode redimensionar. */
export const Resize: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['none', 'vertical', 'both'] as const).map((resize) => (
        <Textarea key={resize} {...args} resize={resize} placeholder={`resize: ${resize}`} />
      ))}
    </div>
  ),
};

export const Invalid: Story = { args: { invalid: true, defaultValue: 'texto com erro' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'desabilitado' } };
export const FullWidth: Story = { args: { fullWidth: true }, parameters: { layout: 'padded' } };
