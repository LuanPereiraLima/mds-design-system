import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StepHelper } from './StepHelper';
import { Button } from '../Button';

const STEPS = [
  { label: 'Dados', description: 'Seus dados pessoais' },
  { label: 'Documentos', description: 'Envio dos comprovantes' },
  { label: 'Revisão', description: 'Confira antes de enviar' },
  { label: 'Conclusão' },
];

const meta = {
  title: 'Componentes/Seleção/Step Helper',
  component: StepHelper,
  parameters: { layout: 'padded' },
  args: {
    steps: STEPS,
    current: 1,
    orientation: 'horizontal',
    label: 'Progresso do cadastro',
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    current: { control: { type: 'number', min: 0, max: 3 } },
    onStepClick: { action: 'passo' },
  },
} satisfies Meta<typeof StepHelper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = { args: { orientation: 'horizontal' } };

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <StepHelper {...args} />
    </div>
  ),
};

/** Os três estados de um passo, lado a lado. */
export const States: Story = {
  args: { current: 2 },
};

export const FirstStep: Story = { args: { current: 0 } };
export const Completed: Story = { args: { current: STEPS.length } };

export const WithoutDescriptions: Story = {
  args: { steps: STEPS.map(({ label }) => ({ label })) },
};

/** Com `onStepClick`, os passos já percorridos viram botões — os futuros não. */
export const Navigable: Story = {
  render: (args) => {
    const [current, setCurrent] = useState(2);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <StepHelper {...args} current={current} onStepClick={setCurrent} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            appearance="outlined"
            onClick={() => setCurrent((v) => Math.max(0, v - 1))}
            disabled={current === 0}
          >
            Voltar
          </Button>
          <Button
            onClick={() => setCurrent((v) => Math.min(STEPS.length, v + 1))}
            disabled={current >= STEPS.length}
          >
            Avançar
          </Button>
        </div>
      </div>
    );
  },
};
