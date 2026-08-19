import { forwardRef } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import type { InputFeedback, InputRadius, InputSize } from '../Input';
import { DropdownRoot, StyledSelect, Chevron } from './InputDropdown.styles';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface InputDropdownProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Options to render. Ignored when `children` is provided. */
  options?: DropdownOption[];
  /** Non-selectable first entry, shown while nothing is picked. */
  placeholder?: string;
  /** Border radius, mapped to the `--input-radius-*` tokens. */
  radius?: InputRadius;
  size?: InputSize;
  /** Validation state, colored by the matching feedback role. */
  feedback?: InputFeedback;
  /** Shorthand for `feedback="critical"` that also sets `aria-invalid`. */
  invalid?: boolean;
  fullWidth?: boolean;
  /** Custom option markup, when `options` is not enough. */
  children?: ReactNode;
  /** Class applied to the wrapper, not to the select. */
  className?: string;
}

/**
 * Single-select field.
 *
 * Built on the native `<select>` on purpose: it gets keyboard support,
 * type-ahead and the platform's own picker on mobile for free. Only the
 * chrome is ours — the arrow and the token-driven surface.
 */
export const InputDropdown = forwardRef<HTMLSelectElement, InputDropdownProps>(
  function InputDropdown(
    {
      options,
      placeholder,
      radius = 'default',
      size = 'md',
      feedback,
      invalid = false,
      fullWidth = false,
      children,
      className,
      defaultValue,
      value,
      ...rest
    },
    ref,
  ) {
    const role = feedback ?? (invalid ? 'critical' : undefined);
    // With a placeholder and no chosen value, start on the placeholder entry.
    const uncontrolledDefault =
      value === undefined && defaultValue === undefined && placeholder ? '' : defaultValue;

    return (
      <DropdownRoot className={className} $fullWidth={fullWidth} data-feedback={role}>
        <StyledSelect
          {...rest}
          ref={ref}
          value={value}
          defaultValue={uncontrolledDefault}
          $radius={radius}
          $size={size}
          $feedback={Boolean(role)}
          $fullWidth={fullWidth}
          aria-invalid={invalid || undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children ??
            options?.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
        </StyledSelect>
        <Chevron aria-hidden="true" $size={size}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="m4 6 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Chevron>
      </DropdownRoot>
    );
  },
);

InputDropdown.displayName = 'InputDropdown';
