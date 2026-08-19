import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import type { InputFeedback, InputRadius } from '../Input';
import { SelectorRoot, SelectorInput, SelectorBody, SelectorLabel, SelectorDescription, SelectorIcon, SelectorMark } from './Selector.styles';

/** Whether picking one clears the others (`single`) or not (`multiple`). */
export type SelectorMode = 'single' | 'multiple';

export interface SelectorProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Main line of the option. */
  label: ReactNode;
  /** Supporting line under the label. */
  description?: ReactNode;
  /** Element shown at the leading edge, usually an icon or illustration. */
  icon?: ReactNode;
  /** `single` renders a radio, `multiple` a checkbox. */
  mode?: SelectorMode;
  /** Validation state, colored by the matching feedback role. */
  feedback?: InputFeedback;
  /** Shorthand for `feedback="critical"` that also sets `aria-invalid`. */
  invalid?: boolean;
  radius?: InputRadius;
  fullWidth?: boolean;
}

/**
 * A whole card that behaves as one option — the pattern for picking a plan, an
 * address or a payment method, where a bare radio would be too small a target.
 *
 * The real input stays in the DOM (visually hidden) so selection, keyboard and
 * form submission are the platform's, not ours.
 */
export const Selector = forwardRef<HTMLInputElement, SelectorProps>(function Selector(
  {
    label,
    description,
    icon,
    mode = 'single',
    feedback,
    invalid = false,
    radius = 'default',
    fullWidth = false,
    id,
    className,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const role = feedback ?? (invalid ? 'critical' : undefined);

  return (
    <SelectorRoot
      className={className}
      htmlFor={inputId}
      data-feedback={role}
      $radius={radius}
      $fullWidth={fullWidth}
      $feedback={Boolean(role)}
      $disabled={Boolean(rest.disabled)}
    >
      <SelectorInput
        {...rest}
        ref={ref}
        id={inputId}
        type={mode === 'single' ? 'radio' : 'checkbox'}
        aria-invalid={invalid || undefined}
      />
      {icon && <SelectorIcon aria-hidden="true">{icon}</SelectorIcon>}
      <SelectorBody>
        <SelectorLabel>{label}</SelectorLabel>
        {description && <SelectorDescription>{description}</SelectorDescription>}
      </SelectorBody>
      <SelectorMark aria-hidden="true" $mode={mode} />
    </SelectorRoot>
  );
});

Selector.displayName = 'Selector';
