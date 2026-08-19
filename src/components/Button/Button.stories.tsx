import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import type { ButtonAppearance, ButtonFeedback, ButtonTone, ButtonVariant } from './Button';

const APPEARANCES: ButtonAppearance[] = ['filled', 'outlined', 'ghost'];
const CHANNELS: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'complementary'];
const TONES: ButtonTone[] = ['default', 'alternate', 'inverse'];
const FEEDBACKS: ButtonFeedback[] = ['success', 'caution', 'critical', 'info'];

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8.5 6.5 12 13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Linha de exemplos com rótulo à esquerda. */
const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
    <span style={{ width: 110, fontSize: 13, fontFamily: 'monospace', color: 'var(--subtle-on-background)' }}>
      {label}
    </span>
    {children}
  </div>
);

const meta = {
  title: 'Componentes/Ações/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: {
    children: 'Button',
    variant: 'primary',
    intent: 'brand',
    tone: 'default',
    appearance: 'filled',
    size: 'md',
    radius: 'default',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: CHANNELS,
      description: 'Canal visual — só se aplica quando `intent` é `brand`.',
    },
    intent: {
      control: 'inline-radio',
      options: ['brand', 'feedback', 'neutral'],
      description: 'Base semântica de onde as cores vêm.',
    },
    feedback: {
      control: 'inline-radio',
      options: FEEDBACKS,
      description: 'Papel de feedback — só se aplica quando `intent` é `feedback`.',
    },
    tone: { control: 'inline-radio', options: TONES },
    appearance: { control: 'inline-radio', options: APPEARANCES },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    radius: { control: 'inline-radio', options: ['small', 'default', 'large', 'full'] },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Todos os controles ligados — bom ponto de partida pra explorar a API. */
export const Playground: Story = {};

export const Filled: Story = { args: { appearance: 'filled' } };
export const Outlined: Story = { args: { appearance: 'outlined' } };
export const Ghost: Story = { args: { appearance: 'ghost' } };

/** Os três preenchimentos lado a lado. */
export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {APPEARANCES.map((appearance) => (
        <Button key={appearance} {...args} appearance={appearance}>
          {appearance}
        </Button>
      ))}
    </div>
  ),
};

/** Os 4 canais visuais da marca ativa. Troque a marca na toolbar. */
export const Channels: Story = {
  render: (args) => (
    <div>
      {APPEARANCES.map((appearance) => (
        <Row key={appearance} label={appearance}>
          {CHANNELS.map((variant) => (
            <Button key={variant} {...args} appearance={appearance} variant={variant}>
              {variant}
            </Button>
          ))}
        </Row>
      ))}
    </div>
  ),
};

/**
 * As três intenções: a paleta da marca (`brand`, escolhida por `variant`), um
 * papel de feedback (`feedback`) e a escala neutra (`neutral`).
 */
export const Intents: Story = {
  render: (args) => (
    <div>
      <Row label="brand">
        {APPEARANCES.map((appearance) => (
          <Button key={appearance} {...args} intent="brand" appearance={appearance}>
            {appearance}
          </Button>
        ))}
      </Row>
      <Row label="feedback">
        {APPEARANCES.map((appearance) => (
          <Button key={appearance} {...args} intent="feedback" feedback="success" appearance={appearance}>
            {appearance}
          </Button>
        ))}
      </Row>
      <Row label="neutral">
        {APPEARANCES.map((appearance) => (
          <Button key={appearance} {...args} intent="neutral" appearance={appearance}>
            {appearance}
          </Button>
        ))}
      </Row>
    </div>
  ),
};

/** Os 4 papéis de feedback, em cada preenchimento. */
export const FeedbackRoles: Story = {
  args: { intent: 'feedback' },
  render: (args) => (
    <div>
      {APPEARANCES.map((appearance) => (
        <Row key={appearance} label={appearance}>
          {FEEDBACKS.map((feedback) => (
            <Button key={feedback} {...args} intent="feedback" feedback={feedback} appearance={appearance}>
              {feedback}
            </Button>
          ))}
        </Row>
      ))}
    </div>
  ),
};

/** Botões neutros — para ações estruturais, sem cor de marca. */
export const Neutral: Story = {
  args: { intent: 'neutral' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {APPEARANCES.map((appearance) => (
        <Button key={appearance} {...args} intent="neutral" appearance={appearance}>
          {appearance}
        </Button>
      ))}
    </div>
  ),
};

/**
 * Os três tons de cor que a entrega define para a mesma estrutura de botão.
 * `alternate` suaviza o preenchimento; `inverse` troca fundo e conteúdo.
 */
export const Tones: Story = {
  render: (args) => (
    <div>
      {TONES.map((tone) => (
        <Row key={tone} label={tone}>
          {APPEARANCES.map((appearance) => (
            <Button key={appearance} {...args} tone={tone} appearance={appearance}>
              {appearance}
            </Button>
          ))}
        </Row>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

/** Os 4 raios da entrega: 4px, 8px, 12px e totalmente arredondado. */
export const Radii: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {(['small', 'default', 'large', 'full'] as const).map((radius) => (
        <Button key={radius} {...args} radius={radius}>
          {radius}
        </Button>
      ))}
    </div>
  ),
};

/** Ícones antes e/ou depois do rótulo — recebem a cor de ícone do token. */
export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button {...args} startIcon={<CheckIcon />}>
        Confirmar
      </Button>
      <Button {...args} endIcon={<ArrowIcon />}>
        Avançar
      </Button>
      <Button {...args} appearance="outlined" startIcon={<CheckIcon />} endIcon={<ArrowIcon />}>
        Ambos
      </Button>
      <Button {...args} aria-label="Confirmar" startIcon={<CheckIcon />}>
        {null}
      </Button>
    </div>
  ),
};

/**
 * `loading` mostra o spinner e bloqueia a interação sem marcar o botão como
 * `disabled` — que trocaria as cores pelas de desabilitado.
 */
export const Loading: Story = {
  args: { loading: true },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {APPEARANCES.map((appearance) => (
        <Button key={appearance} {...args} appearance={appearance}>
          Enviando
        </Button>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {APPEARANCES.map((appearance) => (
        <Button key={appearance} {...args} appearance={appearance}>
          {appearance}
        </Button>
      ))}
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
};

/** Panorama: 3 tons × 3 preenchimentos, no canal ativo. */
export const Overview: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <table style={{ borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr>
          <th style={{ padding: 8 }} />
          {APPEARANCES.map((appearance) => (
            <th key={appearance} style={{ padding: 8, textAlign: 'left', fontFamily: 'monospace' }}>
              {appearance}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {TONES.map((tone) => (
          <tr key={tone}>
            <td style={{ padding: 8, fontFamily: 'monospace' }}>{tone}</td>
            {APPEARANCES.map((appearance) => (
              <td key={appearance} style={{ padding: 8 }}>
                <Button {...args} tone={tone} appearance={appearance}>
                  Button
                </Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
