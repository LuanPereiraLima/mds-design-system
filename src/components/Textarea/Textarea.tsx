import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { StyledTextarea } from './Textarea.styles';

/** Border radius scale, mapped to the input radius design tokens. */
export type TextareaRadius = 'small' | 'default' | 'large' | 'full';
export type TextareaSize = 'sm' | 'md' | 'lg';
/** Validation role, drawn from the feedback family. */
export type TextareaFeedback = 'success' | 'caution' | 'critical' | 'info';
/** Which directions the user may resize the field in. */
export type TextareaResize = 'none' | 'vertical' | 'both';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Border radius, mapped to the `--input-radius-*` tokens. */
  radius?: TextareaRadius;
  /** Size of the field. */
  size?: TextareaSize;
  /** Validation state, colored by the matching feedback role. */
  feedback?: TextareaFeedback;
  /** Shorthand for `feedback="critical"` that also sets `aria-invalid`. */
  invalid?: boolean;
  /** Which directions the user may resize the field in. */
  resize?: TextareaResize;
  /** Stretch the field to fill its container width. */
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    radius = 'default',
    size = 'md',
    feedback,
    invalid = false,
    resize = 'vertical',
    fullWidth = false,
    rows = 4,
    ...rest
  },
  ref,
) {
  const role = feedback ?? (invalid ? 'critical' : undefined);
  return (
    <StyledTextarea
      ref={ref}
      rows={rows}
      // `--feedback` only exists inside a `[data-feedback="<role>"]` scope, so
      // the attribute has to sit on the field for the accent to resolve.
      data-feedback={role}
      $radius={radius}
      $size={size}
      $feedback={Boolean(role)}
      $resize={resize}
      $fullWidth={fullWidth}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});

Textarea.displayName = 'Textarea';
