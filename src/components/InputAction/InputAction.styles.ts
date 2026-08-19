import styled, { css } from 'styled-components';
import type { InputSize } from '../Input';

interface RootProps {
  $size: InputSize;
  $fullWidth: boolean;
}

/** Width reserved for the trailing button, per field size. */
const SLOT: Record<InputSize, string> = { sm: '32px', md: '40px', lg: '48px' };

export const ActionButton = styled.button<{ $size: InputSize }>`
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  width: ${({ $size }) => SLOT[$size]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--subtle-on-surface);
  cursor: pointer;
  border-radius: inherit;
  transition: color 0.15s ease;

  &:hover:not(:disabled) {
    color: var(--on-surface);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const InputActionRoot = styled.span<RootProps>`
  position: relative;
  display: ${({ $fullWidth }) => ($fullWidth ? 'block' : 'inline-block')};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  /* Reserve room so the value never runs under the button. */
  ${({ $size }) => css`
    > input {
      padding-right: ${SLOT[$size]};
    }
  `}
`;
