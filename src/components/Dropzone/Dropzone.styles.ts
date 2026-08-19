import styled, { css } from 'styled-components';
import type { InputRadius } from '../Input';

interface RootProps {
  $dragging: boolean;
  $radius: InputRadius;
  $fullWidth: boolean;
  /** Whether a feedback role is active — its color comes from `var(--feedback)`,
   * resolved by the `data-feedback` attribute on the root. */
  $feedback: boolean;
}

const accent = ({ $feedback }: RootProps) => ($feedback ? 'var(--feedback)' : 'var(--primary)');

export const DropzoneIcon = styled.span`
  display: inline-flex;
  color: var(--subtle-on-surface);
`;

export const DropzoneLabel = styled.span`
  font-size: 15px;
  line-height: 22px;
  color: var(--on-surface);
`;

export const DropzoneHint = styled.span`
  font-size: 13px;
  line-height: 18px;
  color: var(--subtle-on-surface);
`;

/** Kept in the DOM (not `display: none`) so the control still posts in a
 * plain form; the surrounding button owns the interaction. */
export const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`;

export const DropzoneRoot = styled.button<RootProps>`
  position: relative;
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 132px;
  padding: 24px;
  font-family: inherit;
  text-align: center;
  cursor: pointer;
  background: var(--surface);
  border: 1px dashed
    ${(props) => (props.$feedback ? 'var(--feedback)' : 'var(--outline-emphasized)')};
  border-radius: var(--input-radius-${({ $radius }) => $radius});
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${accent};
  }

  &:focus-visible {
    outline: 2px solid ${accent};
    outline-offset: 2px;
  }

  ${(props) =>
    props.$dragging &&
    css`
      border-color: ${accent(props)};
      background: var(--primary-muted);
    `}

  &:disabled {
    cursor: not-allowed;
    background: var(--background);
    opacity: 0.6;
  }
`;
