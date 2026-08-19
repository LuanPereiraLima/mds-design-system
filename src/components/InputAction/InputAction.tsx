import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Input } from '../Input';
import type { InputProps } from '../Input';
import { InputActionRoot, ActionButton } from './InputAction.styles';

export interface InputActionProps extends InputProps {
  /** Element rendered inside the trailing button (usually an icon). */
  icon: ReactNode;
  /** Accessible name for the trailing button. */
  actionLabel: string;
  /** Fired when the trailing button is activated. */
  onAction?: () => void;
  /** Disables the trailing button on its own, without disabling the field. */
  actionDisabled?: boolean;
  /** Class applied to the wrapper, not to the field. */
  className?: string;
}

/**
 * A field with a trailing action button — search, clear, reveal, pick, and so
 * on. The button sits inside the field's border, and the field reserves room
 * for it so the text never runs underneath.
 */
export const InputAction = forwardRef<HTMLInputElement, InputActionProps>(function InputAction(
  { icon, actionLabel, onAction, actionDisabled = false, className, size = 'md', fullWidth = false, ...rest },
  ref,
) {
  return (
    <InputActionRoot className={className} $size={size} $fullWidth={fullWidth}>
      <Input ref={ref} size={size} fullWidth={fullWidth} {...rest} />
      <ActionButton
        type="button"
        $size={size}
        onClick={onAction}
        aria-label={actionLabel}
        disabled={actionDisabled || rest.disabled}
      >
        {icon}
      </ActionButton>
    </InputActionRoot>
  );
});

InputAction.displayName = 'InputAction';
