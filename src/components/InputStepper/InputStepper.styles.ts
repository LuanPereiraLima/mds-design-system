import styled, { css } from 'styled-components';
import type { InputRadius, InputSize } from '../Input';

interface RootProps {
  $size: InputSize;
  $radius: InputRadius;
  /** Whether a feedback role is active — its color comes from `var(--feedback)`,
   * resolved by the `data-feedback` attribute on the root. */
  $feedback: boolean;
  $disabled: boolean;
  $fullWidth: boolean;
}

const HEIGHT: Record<InputSize, string> = { sm: '32px', md: '40px', lg: '48px' };
const TEXT: Record<InputSize, ReturnType<typeof css>> = {
  sm: css`
    font-size: 14px;
  `,
  md: css`
    font-size: 16px;
  `,
  lg: css`
    font-size: 18px;
  `,
};

const accent = ({ $feedback }: RootProps) => ($feedback ? 'var(--feedback)' : 'var(--primary)');

export const StepperButton = styled.button<{ $size: InputSize }>`
  flex: none;
  width: ${({ $size }) => HEIGHT[$size]};
  align-self: stretch;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--on-surface);
  font-size: 1.2em;
  line-height: 1;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--outline-muted);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--muted-on-surface);
  }
`;

export const StepperField = styled.input<{ $size: InputSize }>`
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  border: none;
  background: transparent;
  color: var(--on-surface);
  font-family: inherit;
  text-align: center;
  padding: 0 4px;
  ${({ $size }) => TEXT[$size]}

  &:focus {
    outline: none;
  }

  /* The flanking buttons replace the native spinners. */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }

  appearance: textfield;

  &:disabled {
    cursor: not-allowed;
  }
`;

export const StepperRoot = styled.span<RootProps>`
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  align-items: center;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  box-sizing: border-box;
  height: ${({ $size }) => HEIGHT[$size]};
  background: var(--surface);
  border: 1px solid ${(props) => (props.$feedback ? 'var(--feedback)' : 'var(--outline)')};
  border-radius: var(--input-radius-${({ $radius }) => $radius});
  overflow: hidden;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover:not(:focus-within) {
    border-color: var(--outline-emphasized);
  }

  &:focus-within {
    border-color: ${accent};
    box-shadow: 0 0 0 2px ${accent};
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      background: var(--background);
      opacity: 0.6;
    `}
`;
