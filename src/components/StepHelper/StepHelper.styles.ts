import styled, { css } from 'styled-components';
import type { StepHelperOrientation, StepState } from './StepHelper';

interface OrientedProps {
  $orientation: StepHelperOrientation;
}

interface StatefulProps {
  $state: StepState;
}

/** Colour of the marker per state: done and current carry the brand, upcoming
 * stays neutral. */
const markerColors: Record<StepState, ReturnType<typeof css>> = {
  completed: css`
    background: var(--primary);
    border-color: var(--primary);
    color: var(--on-primary);
  `,
  current: css`
    background: var(--primary-muted);
    border-color: var(--primary);
    color: var(--primary);
  `,
  upcoming: css`
    background: var(--surface);
    border-color: var(--outline);
    color: var(--subtle-on-surface);
  `,
};

export const StepHelperRoot = styled.ol<OrientedProps>`
  display: flex;
  flex-direction: ${({ $orientation }) => ($orientation === 'vertical' ? 'column' : 'row')};
  align-items: ${({ $orientation }) => ($orientation === 'vertical' ? 'stretch' : 'flex-start')};
  gap: ${({ $orientation }) => ($orientation === 'vertical' ? '4px' : '8px')};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const StepMarker = styled.span<StatefulProps>`
  flex: none;
  width: 28px;
  height: 28px;
  display: inline-grid;
  place-content: center;
  box-sizing: border-box;
  border: 1px solid;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  padding: 0;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  ${({ $state }) => markerColors[$state]}

  /* Only rendered as a button when the step can be revisited. */
  &:is(button) {
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
`;

export const StepBody = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const StepLabel = styled.span<StatefulProps>`
  font-size: 14px;
  line-height: 20px;
  font-weight: ${({ $state }) => ($state === 'current' ? 600 : 400)};
  color: ${({ $state }) =>
    $state === 'upcoming' ? 'var(--subtle-on-background)' : 'var(--on-background)'};
`;

export const StepDescription = styled.span`
  font-size: 13px;
  line-height: 18px;
  color: var(--subtle-on-background);
`;

/** The line between two markers. It reads as done only once the step it
 * leaves behind is done. */
export const StepConnector = styled.span<OrientedProps & StatefulProps>`
  flex: 1 1 auto;
  align-self: ${({ $orientation }) => ($orientation === 'vertical' ? 'stretch' : 'center')};
  background: ${({ $state }) =>
    $state === 'completed' ? 'var(--primary)' : 'var(--outline)'};
  transition: background 0.15s ease;

  ${({ $orientation }) =>
    $orientation === 'vertical'
      ? css`
          width: 2px;
          min-height: 20px;
          justify-self: center;
        `
      : css`
          height: 2px;
          min-width: 24px;
          margin: 0 4px;
        `}
`;

export const StepItem = styled.li<OrientedProps & StatefulProps>`
  display: flex;
  align-items: ${({ $orientation }) => ($orientation === 'vertical' ? 'flex-start' : 'center')};
  gap: 8px;
  min-width: 0;

  /* Vertical uses a 2-column grid: marker and text share the first row, and
     the connector lands under the marker by plain auto-placement — no offsets
     to keep in sync. */
  ${({ $orientation }) =>
    $orientation === 'vertical' &&
    css`
      display: grid;
      grid-template-columns: 28px 1fr;
      column-gap: 8px;
      row-gap: 4px;
      align-items: start;
    `}

  ${({ $orientation }) =>
    $orientation === 'horizontal' &&
    css`
      flex: 1 1 0;

      &:last-child {
        flex: none;
      }
    `}
`;
