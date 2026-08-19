import styled, { css } from 'styled-components';
import type { CheckboxSize } from './Checkbox';

interface SizedProps {
  $size: CheckboxSize;
}

interface StyledCheckboxProps extends SizedProps {
  /** Whether a feedback role is active — its color comes from `var(--feedback)`,
   * resolved by the `data-feedback` attribute on the wrapper. */
  $feedback: boolean;
}

const BOX: Record<CheckboxSize, string> = { sm: '16px', md: '20px', lg: '24px' };
const TEXT: Record<CheckboxSize, ReturnType<typeof css>> = {
  sm: css`
    font-size: 14px;
    line-height: 20px;
  `,
  md: css`
    font-size: 16px;
    line-height: 24px;
  `,
  lg: css`
    font-size: 18px;
    line-height: 28px;
  `,
};

/** The accent that fills the box: the active feedback role when there is one,
 * the brand primary otherwise. */
const accent = ({ $feedback }: StyledCheckboxProps) =>
  $feedback ? 'var(--feedback)' : 'var(--primary)';

export const CheckboxRoot = styled.span<SizedProps>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  ${({ $size }) => TEXT[$size]}
`;

export const CheckboxLabel = styled.label`
  color: var(--on-background);
  cursor: pointer;

  &:has(~ input:disabled),
  input:disabled ~ & {
    cursor: not-allowed;
  }
`;

export const StyledCheckbox = styled.input<StyledCheckboxProps>`
  appearance: none;
  margin: 0;
  flex: none;
  width: ${({ $size }) => BOX[$size]};
  height: ${({ $size }) => BOX[$size]};
  display: inline-grid;
  place-content: center;
  box-sizing: border-box;
  background: var(--surface);
  border: 1px solid ${(props) => (props.$feedback ? 'var(--feedback)' : 'var(--outline)')};
  border-radius: var(--input-radius-small);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  /* The tick and the dash are drawn with a single box, reshaped per state. */
  &::before {
    content: '';
    width: 0.6em;
    height: 0.6em;
    transform: scale(0);
    transition: transform 0.12s ease-in-out;
    box-shadow: inset 1em 1em var(--on-primary);
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  &:checked,
  &:indeterminate {
    background: ${accent};
    border-color: ${accent};
  }

  &:checked::before,
  &:indeterminate::before {
    transform: scale(1);
  }

  &:indeterminate::before {
    clip-path: polygon(10% 40%, 90% 40%, 90% 60%, 10% 60%);
  }

  &:hover:not(:disabled) {
    border-color: var(--outline-emphasized);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${accent};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: var(--background);
  }
`;
