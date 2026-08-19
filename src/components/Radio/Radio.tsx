import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { RadioRoot, StyledRadio, RadioLabel } from './Radio.styles';

export type RadioSize = 'sm' | 'md' | 'lg';
/** Validation role, drawn from the feedback family. */
export type RadioFeedback = 'success' | 'caution' | 'critical' | 'info';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Text (or nodes) shown next to the dot. */
  label?: ReactNode;
  /** Size of the dot and its label. */
  size?: RadioSize;
  /** Validation state, colored by the matching feedback role. */
  feedback?: RadioFeedback;
  /** Shorthand for `feedback="critical"` that also sets `aria-invalid`. */
  invalid?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, size = 'md', feedback, invalid = false, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const role = feedback ?? (invalid ? 'critical' : undefined);

  return (
    <RadioRoot className={className} $size={size} data-feedback={role}>
      <StyledRadio
        {...rest}
        ref={ref}
        id={inputId}
        type="radio"
        $size={size}
        $feedback={Boolean(role)}
        aria-invalid={invalid || undefined}
      />
      {label !== undefined && <RadioLabel htmlFor={inputId}>{label}</RadioLabel>}
    </RadioRoot>
  );
});

Radio.displayName = 'Radio';
