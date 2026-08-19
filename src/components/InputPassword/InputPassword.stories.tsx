import type { Meta, StoryObj } from '@storybook/react';
import { InputPassword } from './InputPassword';

const meta = {
  title: 'Componentes/Entrada/Input Password',
  component: InputPassword,
  parameters: { layout: 'centered' },
  args: {
    placeholder: 'Sua senha',
    defaultVisible: false,
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
} satisfies Meta<typeof InputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

/** O botão alterna o `type` do campo, então gerenciadores de senha e autofill
 * continuam funcionando. */
export const Playground: Story = {};

export const StartsVisible: Story = {
  args: { defaultVisible: true, defaultValue: 'senha-visivel' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <InputPassword key={size} {...args} size={size} placeholder={size} />
      ))}
    </div>
  ),
};

export const Invalid: Story = { args: { invalid: true, defaultValue: '123' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'senha' } };
export const FullWidth: Story = { args: { fullWidth: true }, parameters: { layout: 'padded' } };
