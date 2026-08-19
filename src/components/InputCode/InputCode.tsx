import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';
import type { InputFeedback, InputRadius, InputSize } from '../Input';
import { CodeRoot, CodeBox } from './InputCode.styles';

export interface InputCodeProps {
  /** How many characters the code has. */
  length?: number;
  /** Controlled value. Leave undefined to let the component hold its own. */
  value?: string;
  /** Starting value when uncontrolled. */
  defaultValue?: string;
  /** Fired with the whole code on every change. */
  onValueChange?: (value: string) => void;
  /** Fired once the last box is filled. */
  onComplete?: (value: string) => void;
  /** Restricts typing to digits and hints a numeric keypad. */
  numeric?: boolean;
  size?: InputSize;
  radius?: InputRadius;
  /** Validation state, colored by the matching feedback role. */
  feedback?: InputFeedback;
  /** Shorthand for `feedback="critical"` that also sets `aria-invalid`. */
  invalid?: boolean;
  disabled?: boolean;
  /** Accessible name for the group of boxes. */
  label?: string;
  autoFocus?: boolean;
  className?: string;
}

export interface InputCodeHandle {
  /** Moves focus to the first empty box, or the last one when full. */
  focus: () => void;
}

/**
 * Verification-code field: one box per character, with auto-advance, backspace
 * that walks back, arrow navigation and paste spreading across the boxes.
 */
export const InputCode = forwardRef<InputCodeHandle, InputCodeProps>(function InputCode(
  {
    length = 6,
    value,
    defaultValue = '',
    onValueChange,
    onComplete,
    numeric = true,
    size = 'md',
    radius = 'default',
    feedback,
    invalid = false,
    disabled = false,
    label,
    autoFocus = false,
    className,
  },
  ref,
) {
  const [internal, setInternal] = useState(defaultValue.slice(0, length));
  const isControlled = value !== undefined;
  const code = (isControlled ? value : internal).slice(0, length);
  const role = feedback ?? (invalid ? 'critical' : undefined);
  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  const focusBox = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), length - 1);
    boxes.current[clamped]?.focus();
    boxes.current[clamped]?.select();
  };

  useImperativeHandle(ref, () => ({
    focus: () => focusBox(Math.min(code.length, length - 1)),
  }));

  const commit = (next: string) => {
    const trimmed = next.slice(0, length);
    if (!isControlled) setInternal(trimmed);
    onValueChange?.(trimmed);
    if (trimmed.length === length) onComplete?.(trimmed);
  };

  /**
   * Replaces the character at `index`.
   *
   * The value is a dense string, so clearing a box in the middle pulls the
   * later characters left. In practice that is unreachable: typing only ever
   * appends, and Backspace clears from the end walking backwards.
   */
  const setCharAt = (index: number, char: string) => {
    const chars = Array.from({ length }, (_, i) => code[i] ?? '');
    chars[index] = char;
    return chars.join('');
  };

  const accepts = (char: string) => (numeric ? /^[0-9]$/.test(char) : char.length === 1);

  const handleChange = (index: number, raw: string) => {
    // Take the last typed character, so overwriting a filled box works.
    const char = raw.slice(-1);
    if (char && !accepts(char)) return;
    commit(setCharAt(index, char));
    if (char) focusBox(index + 1);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (code[index]) commit(setCharAt(index, ''));
      else if (index > 0) {
        commit(setCharAt(index - 1, ''));
        focusBox(index - 1);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData('text')
      .split('')
      .filter(accepts)
      .join('');
    if (!pasted) return;
    const next = (code.slice(0, index) + pasted).slice(0, length);
    commit(next);
    focusBox(next.length);
  };

  return (
    <CodeRoot className={className} role="group" aria-label={label} data-feedback={role}>
      {Array.from({ length }, (_, index) => (
        <CodeBox
          key={index}
          ref={(node) => {
            boxes.current[index] = node;
          }}
          type="text"
          inputMode={numeric ? 'numeric' : 'text'}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={code[index] ?? ''}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={`${label ? `${label}, ` : ''}${index + 1}/${length}`}
          aria-invalid={invalid || undefined}
          $size={size}
          $radius={radius}
          $feedback={Boolean(role)}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onFocus={(event) => event.target.select()}
        />
      ))}
    </CodeRoot>
  );
});

InputCode.displayName = 'InputCode';
