import { forwardRef, useEffect, useId, useRef } from 'react';
import type { InputHTMLAttributes, MutableRefObject, ReactNode } from 'react';
import { CheckboxRoot, StyledCheckbox, CheckboxLabel } from './Checkbox.styles';

export type CheckboxSize = 'sm' | 'md' | 'lg';
/** Validation role, drawn from the feedback family. */
export type CheckboxFeedback = 'success' | 'caution' | 'critical' | 'info';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Text (or nodes) shown next to the box. */
  label?: ReactNode;
  /** Size of the box and its label. */
  size?: CheckboxSize;
  /** Renders the mixed state. Purely visual until the consumer resolves it. */
  indeterminate?: boolean;
  /** Validation state, colored by the matching feedback role. */
  feedback?: CheckboxFeedback;
  /** Shorthand for `feedback="critical"` that also sets `aria-invalid`. */
  invalid?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, size = 'md', indeterminate = false, feedback, invalid = false, id, className, ...rest },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null>(null);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const role = feedback ?? (invalid ? 'critical' : undefined);

  // `indeterminate` exists only as a DOM property — there is no attribute for
  // it — so it has to be written to the node after every render.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <CheckboxRoot className={className} $size={size} data-feedback={role}>
      <StyledCheckbox
        {...rest}
        ref={(node: HTMLInputElement | null) => {
          innerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as MutableRefObject<HTMLInputElement | null>).current = node;
        }}
        id={inputId}
        type="checkbox"
        $size={size}
        $feedback={Boolean(role)}
        aria-invalid={invalid || undefined}
      />
      {label !== undefined && <CheckboxLabel htmlFor={inputId}>{label}</CheckboxLabel>}
    </CheckboxRoot>
  );
});

Checkbox.displayName = 'Checkbox';
