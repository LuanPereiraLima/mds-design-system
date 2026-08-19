import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { StyledInput } from './Input.styles';

/** Border radius scale, mapped to the input radius design tokens. */
export type InputRadius = 'small' | 'default' | 'large' | 'full';
/** Size of the input. */
export type InputSize = 'sm' | 'md' | 'lg';
/** Validation role, drawn from the feedback family. */
export type InputFeedback = 'success' | 'caution' | 'critical' | 'info';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Border radius, mapped to the `--input-radius-*` tokens. */
  radius?: InputRadius;
  /** Size of the input. */
  size?: InputSize;
  /** Validation state, colored by the matching feedback role. */
  feedback?: InputFeedback;
  /** Shorthand for `feedback="critical"` that also sets `aria-invalid`. */
  invalid?: boolean;
  /** Stretch the input to fill its container width. */
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { radius = 'default', size = 'md', feedback, invalid = false, fullWidth = false, ...rest },
  ref,
) {
  const role = feedback ?? (invalid ? 'critical' : undefined);
  return (
    <StyledInput
      ref={ref}
      // `--feedback` only exists inside a `[data-feedback="<role>"]` scope, so
      // the attribute has to sit on the input for the accent to resolve.
      data-feedback={role}
      $radius={radius}
      $size={size}
      $feedback={Boolean(role)}
      $fullWidth={fullWidth}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});

Input.displayName = 'Input';
