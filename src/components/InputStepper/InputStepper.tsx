import { forwardRef, useState } from 'react';
import type { InputFeedback, InputRadius, InputSize } from '../Input';
import { StepperRoot, StepperButton, StepperField } from './InputStepper.styles';

export interface InputStepperProps {
  /** Controlled value. Leave undefined to let the component hold its own. */
  value?: number;
  /** Starting value when uncontrolled. */
  defaultValue?: number;
  /** Fired with the new value on every change, from the buttons or by typing. */
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: InputSize;
  radius?: InputRadius;
  /** Validation state, colored by the matching feedback role. */
  feedback?: InputFeedback;
  /** Shorthand for `feedback="critical"` that also sets `aria-invalid`. */
  invalid?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Accessible name for the whole control. */
  label?: string;
  decrementLabel?: string;
  incrementLabel?: string;
  name?: string;
  id?: string;
  className?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Numeric field flanked by decrement and increment buttons. Works controlled
 * (`value` + `onValueChange`) or uncontrolled (`defaultValue`).
 */
export const InputStepper = forwardRef<HTMLInputElement, InputStepperProps>(function InputStepper(
  {
    value,
    defaultValue = 0,
    onValueChange,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    step = 1,
    size = 'md',
    radius = 'default',
    feedback,
    invalid = false,
    disabled = false,
    fullWidth = false,
    label,
    decrementLabel = 'Diminuir',
    incrementLabel = 'Aumentar',
    className,
    ...rest
  },
  ref,
) {
  const [internal, setInternal] = useState(clamp(defaultValue, min, max));
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const role = feedback ?? (invalid ? 'critical' : undefined);

  const commit = (next: number) => {
    const clamped = clamp(next, min, max);
    if (!isControlled) setInternal(clamped);
    onValueChange?.(clamped);
  };

  return (
    <StepperRoot
      className={className}
      role="group"
      aria-label={label}
      data-feedback={role}
      $size={size}
      $radius={radius}
      $feedback={Boolean(role)}
      $disabled={disabled}
      $fullWidth={fullWidth}
    >
      <StepperButton
        type="button"
        $size={size}
        onClick={() => commit(current - step)}
        disabled={disabled || current <= min}
        aria-label={decrementLabel}
      >
        −
      </StepperButton>
      <StepperField
        {...rest}
        ref={ref}
        type="number"
        inputMode="numeric"
        $size={size}
        value={current}
        min={min === Number.NEGATIVE_INFINITY ? undefined : min}
        max={max === Number.POSITIVE_INFINITY ? undefined : max}
        step={step}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (!Number.isNaN(parsed)) commit(parsed);
        }}
      />
      <StepperButton
        type="button"
        $size={size}
        onClick={() => commit(current + step)}
        disabled={disabled || current >= max}
        aria-label={incrementLabel}
      >
        +
      </StepperButton>
    </StepperRoot>
  );
});

InputStepper.displayName = 'InputStepper';
