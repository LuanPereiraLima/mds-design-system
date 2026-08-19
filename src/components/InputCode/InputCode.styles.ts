import styled, { css } from 'styled-components';
import type { InputRadius, InputSize } from '../Input';

interface BoxProps {
  $size: InputSize;
  $radius: InputRadius;
  /** Whether a feedback role is active — its color comes from `var(--feedback)`,
   * resolved by the `data-feedback` attribute on the group. */
  $feedback: boolean;
}

const BOX: Record<InputSize, ReturnType<typeof css>> = {
  sm: css`
    width: 32px;
    height: 40px;
    font-size: 16px;
  `,
  md: css`
    width: 40px;
    height: 48px;
    font-size: 20px;
  `,
  lg: css`
    width: 48px;
    height: 56px;
    font-size: 24px;
  `,
};

const accent = ({ $feedback }: BoxProps) => ($feedback ? 'var(--feedback)' : 'var(--primary)');

export const CodeRoot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const CodeBox = styled.input<BoxProps>`
  box-sizing: border-box;
  text-align: center;
  font-family: inherit;
  font-weight: 600;
  color: var(--on-surface);
  background: var(--surface);
  border: 1px solid ${(props) => (props.$feedback ? 'var(--feedback)' : 'var(--outline)')};
  border-radius: var(--input-radius-${({ $radius }) => $radius});
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  ${({ $size }) => BOX[$size]}

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
    opacity: 0.6;
  }
`;
