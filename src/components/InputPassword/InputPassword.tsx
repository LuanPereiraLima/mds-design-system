import { forwardRef, useState } from 'react';
import { InputAction } from '../InputAction';
import type { InputProps } from '../Input';

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M1.5 9S4.5 3.75 9 3.75 16.5 9 16.5 9s-3 5.25-7.5 5.25S1.5 9 1.5 9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M7.5 4.05A6.6 6.6 0 0 1 9 3.75c4.5 0 7.5 5.25 7.5 5.25a13 13 0 0 1-2.06 2.7M4.6 4.98A13 13 0 0 0 1.5 9S4.5 14.25 9 14.25c1.3 0 2.43-.44 3.38-1.05M2.25 2.25l13.5 13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface InputPasswordProps extends Omit<InputProps, 'type'> {
  /** Whether the value starts revealed. */
  defaultVisible?: boolean;
  /** Accessible name for the toggle when the value is hidden. */
  showLabel?: string;
  /** Accessible name for the toggle when the value is revealed. */
  hideLabel?: string;
  /** Class applied to the wrapper, not to the field. */
  className?: string;
}

/**
 * Password field with a reveal toggle. The toggle flips the input `type`, so
 * password managers and autofill keep working.
 */
export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  function InputPassword(
    { defaultVisible = false, showLabel = 'Mostrar senha', hideLabel = 'Ocultar senha', ...rest },
    ref,
  ) {
    const [visible, setVisible] = useState(defaultVisible);

    return (
      <InputAction
        ref={ref}
        type={visible ? 'text' : 'password'}
        icon={visible ? <EyeOffIcon /> : <EyeIcon />}
        actionLabel={visible ? hideLabel : showLabel}
        onAction={() => setVisible((v) => !v)}
        {...rest}
      />
    );
  },
);

InputPassword.displayName = 'InputPassword';
