import type { Meta, StoryObj } from '@storybook/react';
import { InputAction } from './InputAction';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="m12 12 3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ClearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="m5 5 8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="2.75" y="3.75" width="12.5" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.75 7.25h12.5M6 2.5v2.5M12 2.5v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const meta = {
  title: 'Componentes/Entrada/Input Action',
  component: InputAction,
  parameters: { layout: 'centered' },
  args: {
    placeholder: 'Buscar...',
    icon: <SearchIcon />,
    actionLabel: 'Buscar',
    radius: 'default',
    size: 'md',
    invalid: false,
    disabled: false,
    actionDisabled: false,
    fullWidth: false,
  },
  argTypes: {
    radius: { control: 'inline-radio', options: ['small', 'default', 'large', 'full'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    feedback: { control: 'inline-radio', options: ['success', 'caution', 'critical', 'info'] },
    onAction: { action: 'action' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof InputAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** O mesmo componente serve a qualquer ação de fim de campo. */
export const Uses: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <InputAction {...args} icon={<SearchIcon />} actionLabel="Buscar" placeholder="Buscar" />
      <InputAction
        {...args}
        icon={<ClearIcon />}
        actionLabel="Limpar"
        defaultValue="texto a limpar"
      />
      <InputAction
        {...args}
        icon={<CalendarIcon />}
        actionLabel="Escolher data"
        placeholder="dd/mm/aaaa"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <InputAction key={size} {...args} size={size} placeholder={size} />
      ))}
    </div>
  ),
};

/** `actionDisabled` desliga só o botão, mantendo o campo editável. */
export const ActionDisabled: Story = { args: { actionDisabled: true } };
export const Invalid: Story = { args: { invalid: true, defaultValue: 'inválido' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'desabilitado' } };
export const FullWidth: Story = { args: { fullWidth: true }, parameters: { layout: 'padded' } };
