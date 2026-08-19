import styled, { css } from 'styled-components';
import type { InputRadius } from '../Input';
import type { SelectorMode } from './Selector';

interface RootProps {
  $radius: InputRadius;
  $fullWidth: boolean;
  /** Whether a feedback role is active — its color comes from `var(--feedback)`,
   * resolved by the `data-feedback` attribute on the root. */
  $feedback: boolean;
  $disabled: boolean;
}

const accent = ({ $feedback }: RootProps) => ($feedback ? 'var(--feedback)' : 'var(--primary)');

/** The input drives every visual state through sibling selectors, so it has to
 * stay in the DOM — hidden, not removed. */
export const SelectorInput = styled.input`
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

export const SelectorIcon = styled.span`
  display: inline-flex;
  flex: none;
  color: var(--on-surface);
`;

export const SelectorBody = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1 1 auto;
  min-width: 0;
`;

export const SelectorLabel = styled.span`
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: var(--on-surface);
`;

export const SelectorDescription = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: var(--subtle-on-surface);
`;

/** The tick / dot that mirrors the hidden input's state. */
export const SelectorMark = styled.span<{ $mode: SelectorMode }>`
  flex: none;
  width: 20px;
  height: 20px;
  display: inline-grid;
  place-content: center;
  box-sizing: border-box;
  border: 1px solid var(--outline);
  border-radius: ${({ $mode }) => ($mode === 'single' ? '50%' : 'var(--input-radius-small)')};
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: ${({ $mode }) => ($mode === 'single' ? '50%' : '2px')};
    transform: scale(0);
    transition: transform 0.12s ease-in-out;
    box-shadow: inset 1em 1em var(--on-primary);
  }
`;

export const SelectorRoot = styled.label<RootProps>`
  position: relative;
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  box-sizing: border-box;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--surface);
  border: 1px solid ${(props) => (props.$feedback ? 'var(--feedback)' : 'var(--outline)')};
  border-radius: var(--input-radius-${({ $radius }) => $radius});
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: var(--outline-emphasized);
  }

  /* Selected: the card itself carries the state, not just the mark. */
  &:has(input:checked) {
    border-color: ${accent};
    background: var(--primary-muted);
  }

  &:has(input:checked) ${SelectorMark} {
    border-color: ${accent};
    background: ${accent};
  }

  &:has(input:checked) ${SelectorMark}::before {
    transform: scale(1);
  }

  &:has(input:focus-visible) {
    box-shadow: 0 0 0 2px ${accent};
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
      background: var(--background);
    `}
`;
