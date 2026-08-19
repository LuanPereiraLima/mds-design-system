import styled, { css } from 'styled-components';
import type { InputRadius, InputSize } from '../Input';

interface SelectProps {
  $radius: InputRadius;
  $size: InputSize;
  /** Whether a feedback role is active — its color comes from `var(--feedback)`,
   * resolved by the `data-feedback` attribute on the wrapper. */
  $feedback: boolean;
  $fullWidth: boolean;
}

/** Width reserved for the arrow, per field size. */
const SLOT: Record<InputSize, string> = { sm: '32px', md: '40px', lg: '48px' };

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

const accent = ({ $feedback }: SelectProps) => ($feedback ? 'var(--feedback)' : 'var(--primary)');

export const DropdownRoot = styled.span<{ $fullWidth: boolean }>`
  position: relative;
  display: ${({ $fullWidth }) => ($fullWidth ? 'block' : 'inline-block')};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

export const Chevron = styled.span<{ $size: InputSize }>`
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  width: ${({ $size }) => SLOT[$size]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--subtle-on-surface);
  /* The native select underneath owns every interaction. */
  pointer-events: none;
`;

export const StyledSelect = styled.select<SelectProps>`
  appearance: none;
  display: block;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  box-sizing: border-box;
  font-family: inherit;
  color: var(--on-surface);
  background: var(--surface);
  border: 1px solid ${(props) => (props.$feedback ? 'var(--feedback)' : 'var(--outline)')};
  border-radius: var(--input-radius-${({ $radius }) => $radius});
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  ${({ $size }) => sizeStyles[$size]}
  padding-right: ${({ $size }) => SLOT[$size]};

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

  /* The placeholder entry reads as hint text, not as a value. */
  &:invalid,
  &:has(option[value='']:checked) {
    color: var(--subtle-on-surface);
  }
`;
