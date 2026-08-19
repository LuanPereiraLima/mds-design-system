import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import type { InputFeedback, InputRadius, InputSize } from './Input';

const RADII: InputRadius[] = ['small', 'default', 'large', 'full'];
const SIZES: InputSize[] = ['sm', 'md', 'lg'];
const FEEDBACKS: InputFeedback[] = ['success', 'caution', 'critical', 'info'];

/** Campo com rótulo, para os exemplos que precisam de contexto. */
const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
    <span style={{ fontFamily: 'monospace', color: 'var(--subtle-on-background)' }}>{label}</span>
    {children}
  </label>
);

const Stack = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
);

const meta = {
  title: 'Componentes/Entrada/Input',
  component: Input,
  parameters: { layout: 'centered' },
  args: {
    placeholder: 'Digite algo...',
    radius: 'default',
    size: 'md',
    invalid: false,
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    radius: { control: 'inline-radio', options: RADII },
    size: { control: 'inline-radio', options: SIZES },
    feedback: {
      control: 'inline-radio',
      options: FEEDBACKS,
      description: 'Estado de validação — colore borda e anel de foco pelo papel de feedback.',
    },
    invalid: { description: 'Atalho para `feedback="critical"` que também marca `aria-invalid`.' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Todos os controles ligados. */
export const Playground: Story = {};

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'Maria Aparecida' },
};

/**
 * Os 4 papéis de feedback. A cor vem de `var(--feedback)`, resolvida pelo
 * atributo `data-feedback` no próprio campo — então acompanha marca e modo.
 */
export const FeedbackStates: Story = {
  render: (args) => (
    <Stack>
      {FEEDBACKS.map((feedback) => (
        <Field key={feedback} label={feedback}>
          <Input {...args} feedback={feedback} defaultValue={`estado ${feedback}`} />
        </Field>
      ))}
    </Stack>
  ),
};

/** `invalid` é o atalho de `feedback="critical"` e ainda marca `aria-invalid`. */
export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'valor inválido' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'desabilitado' },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'somente leitura' },
};

/** Os 4 raios da entrega: 4px, 8px, 12px e totalmente arredondado. */
export const Radii: Story = {
  render: (args) => (
    <Stack>
      {RADII.map((radius) => (
        <Input key={radius} {...args} radius={radius} placeholder={radius} />
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack>
      {SIZES.map((size) => (
        <Input key={size} {...args} size={size} placeholder={size} />
      ))}
    </Stack>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
};

/** Tipos nativos de input continuam funcionando — a prop `size` é a do DS. */
export const InputTypes: Story = {
  render: (args) => (
    <Stack>
      <Field label="type=email">
        <Input {...args} type="email" placeholder="nome@dominio.com" />
      </Field>
      <Field label="type=password">
        <Input {...args} type="password" defaultValue="segredo" />
      </Field>
      <Field label="type=number">
        <Input {...args} type="number" defaultValue={42} />
      </Field>
      <Field label="type=date">
        <Input {...args} type="date" />
      </Field>
    </Stack>
  ),
};

/** Formulário curto, mostrando os campos em contexto. */
export const InForm: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Field label="nome">
        <Input {...args} fullWidth placeholder="Seu nome" />
      </Field>
      <Field label="e-mail (validado)">
        <Input {...args} fullWidth type="email" feedback="success" defaultValue="maria@exemplo.com" />
      </Field>
      <Field label="CPF (com erro)">
        <Input {...args} fullWidth invalid defaultValue="000.000.000-00" />
      </Field>
    </form>
  ),
};
