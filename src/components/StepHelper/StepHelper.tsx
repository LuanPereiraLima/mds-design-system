import type { ReactNode } from 'react';
import {
  StepHelperRoot,
  StepItem,
  StepMarker,
  StepConnector,
  StepBody,
  StepLabel,
  StepDescription,
} from './StepHelper.styles';

export interface Step {
  /** Main line of the step. */
  label: ReactNode;
  /** Supporting line under the label. */
  description?: ReactNode;
}

export type StepHelperOrientation = 'horizontal' | 'vertical';
/** Where a step sits relative to the one the user is on. */
export type StepState = 'completed' | 'current' | 'upcoming';

export interface StepHelperProps {
  steps: Step[];
  /** Index of the step the user is on. Everything before it reads as done. */
  current?: number;
  orientation?: StepHelperOrientation;
  /** Makes steps activatable. Only called for steps the user may go back to. */
  onStepClick?: (index: number) => void;
  /** Accessible name for the whole indicator. */
  label?: string;
  className?: string;
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8.5 6.5 12 13 4"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const stateOf = (index: number, current: number): StepState => {
  if (index < current) return 'completed';
  if (index === current) return 'current';
  return 'upcoming';
};

/**
 * Progress indicator for a multi-step flow.
 *
 * Rendered as an ordered list so the sequence survives without CSS, with
 * `aria-current="step"` marking where the user is.
 */
export function StepHelper({
  steps,
  current = 0,
  orientation = 'horizontal',
  onStepClick,
  label,
  className,
}: StepHelperProps) {
  return (
    <StepHelperRoot className={className} aria-label={label} $orientation={orientation}>
      {steps.map((step, index) => {
        const state = stateOf(index, current);
        const clickable = Boolean(onStepClick) && state !== 'upcoming';
        return (
          <StepItem
            key={index}
            $orientation={orientation}
            $state={state}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <StepMarker
              $state={state}
              as={clickable ? 'button' : 'span'}
              type={clickable ? 'button' : undefined}
              onClick={clickable ? () => onStepClick?.(index) : undefined}
            >
              {state === 'completed' ? <CheckIcon /> : index + 1}
            </StepMarker>
            <StepBody>
              <StepLabel $state={state}>{step.label}</StepLabel>
              {step.description && <StepDescription>{step.description}</StepDescription>}
            </StepBody>
            {index < steps.length - 1 && (
              <StepConnector aria-hidden="true" $orientation={orientation} $state={state} />
            )}
          </StepItem>
        );
      })}
    </StepHelperRoot>
  );
}

StepHelper.displayName = 'StepHelper';
