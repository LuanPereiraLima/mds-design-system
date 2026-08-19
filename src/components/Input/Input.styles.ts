import styled, { css } from 'styled-components';
import type { InputRadius, InputSize } from './Input';

interface StyledInputProps {
  $radius: InputRadius;
  $size: InputSize;
  /** Whether a feedback role is active — its color comes from `var(--feedback)`,
   * resolved by the `data-feedback` attribute on the element. */
  $feedback: boolean;
  $fullWidth: boolean;
}

/** The accent used for border and focus ring: the active feedback role when
 * there is one, the brand primary otherwise. */
const accent = ({ $feedback }: StyledInputProps) =>
  $feedback ? 'var(--feedback)' : 'var(--primary)';

const sizeStyles: Record<InputSize, ReturnType<typeof css>> = {
  sm: css`
    font-size: 14px;
    line-height: 20px;
    padding: 6px 12px;
  `,
  md: css`
    font-size: 16px;
    line-height: 24px;
    padding: 10px 12px;
  `,
  lg: css`
    font-size: 18px;
    line-height: 28px;
    padding: 14px 16px;
  `,
};

export const StyledInput = styled.input<StyledInputProps>`
  display: inline-flex;
  align-items: center;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  box-sizing: border-box;
  font-family: inherit;
  color: var(--on-surface);
  background: var(--surface);
  border: 1px solid
    ${(props) => (props.$feedback ? 'var(--feedback)' : 'var(--outline)')};
  border-radius: var(--input-radius-${({ $radius }) => $radius});
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: var(--on-background);
    opacity: 0.7;
  }

  &:hover:not(:disabled):not(:focus) {
    border-color: var(--outline-emphasized);
  }

  &:focus-visible,
  &:focus {
    outline: none;
    border-color: ${accent};
    box-shadow: 0 0 0 2px ${accent};
  }

  &:disabled {
    cursor: not-allowed;
    background: var(--background);
    border-color: var(--outline);
    opacity: 0.6;
  }

  ${({ $size }) => sizeStyles[$size]}
`;
