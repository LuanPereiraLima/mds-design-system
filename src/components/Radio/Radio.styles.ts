import styled, { css } from 'styled-components';
import type { RadioSize } from './Radio';

interface SizedProps {
  $size: RadioSize;
}

interface StyledRadioProps extends SizedProps {
  /** Whether a feedback role is active — its color comes from `var(--feedback)`,
   * resolved by the `data-feedback` attribute on the wrapper. */
  $feedback: boolean;
}

const DOT: Record<RadioSize, string> = { sm: '16px', md: '20px', lg: '24px' };
const TEXT: Record<RadioSize, ReturnType<typeof css>> = {
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

/** The accent that fills the dot: the active feedback role when there is one,
 * the brand primary otherwise. */
const accent = ({ $feedback }: StyledRadioProps) =>
  $feedback ? 'var(--feedback)' : 'var(--primary)';

export const RadioRoot = styled.span<SizedProps>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  ${({ $size }) => TEXT[$size]}
`;

export const RadioLabel = styled.label`
  color: var(--on-background);
  cursor: pointer;
`;

export const StyledRadio = styled.input<StyledRadioProps>`
  appearance: none;
  margin: 0;
  flex: none;
  width: ${({ $size }) => DOT[$size]};
  height: ${({ $size }) => DOT[$size]};
  display: inline-grid;
  place-content: center;
  box-sizing: border-box;
  background: var(--surface);
  border: 1px solid ${(props) => (props.$feedback ? 'var(--feedback)' : 'var(--outline)')};
  border-radius: 50%;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::before {
    content: '';
    width: 0.5em;
    height: 0.5em;
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.12s ease-in-out;
    box-shadow: inset 1em 1em ${accent};
  }

  &:checked {
    border-color: ${accent};
  }

  &:checked::before {
    transform: scale(1);
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
