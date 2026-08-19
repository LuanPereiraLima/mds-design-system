import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { StyledButton } from './Button.styles';

/** Visual channel that colors the button, when `intent` is `brand`. */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'complementary';
/** Which semantic base the button draws its colors from. */
export type ButtonIntent = 'brand' | 'feedback' | 'neutral';
/** Feedback role, used when `intent` is `feedback`. */
export type ButtonFeedback = 'success' | 'caution' | 'critical' | 'info';
/** Color treatment applied on top of the chosen intent. */
export type ButtonTone = 'default' | 'alternate' | 'inverse';
/** Fill style of the button. */
export type ButtonAppearance = 'filled' | 'outlined' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonRadius = 'small' | 'default' | 'large' | 'full';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual channel that colors the button. Only used when `intent` is `brand`. */
  variant?: ButtonVariant;
  /** Semantic base the colors come from: the brand palette, a feedback role or
   * the neutral scale. */
  intent?: ButtonIntent;
  /** Feedback role. Only used when `intent` is `feedback`. */
  feedback?: ButtonFeedback;
  /** Color treatment of the chosen intent. */
  tone?: ButtonTone;
  /** Fill style of the button. */
  appearance?: ButtonAppearance;
  /** Size of the button. */
  size?: ButtonSize;
  /** Corner radius. */
  radius?: ButtonRadius;
  /** Shows a spinner and blocks interaction, without marking the button
   * `disabled` (which would swap in the disabled colors). */
  loading?: boolean;
  /** Element rendered before the label. */
  startIcon?: ReactNode;
  /** Element rendered after the label. */
  endIcon?: ReactNode;
  /** Stretch the button to fill its container width. */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    intent = 'brand',
    feedback = 'success',
    tone = 'default',
    appearance = 'filled',
    size = 'md',
    radius = 'default',
    loading = false,
    startIcon,
    endIcon,
    fullWidth = false,
    children,
    ...rest
  },
  ref,
) {
  return (
    <StyledButton
      ref={ref}
      // `--feedback` is only defined inside a `[data-feedback="<role>"]` scope,
      // so the attribute has to sit on the button itself for the feedback
      // tokens to resolve.
      data-feedback={intent === 'feedback' ? feedback : undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      $variant={variant}
      $intent={intent}
      $tone={tone}
      $appearance={appearance}
      $size={size}
      $radius={radius}
      $fullWidth={fullWidth}
      {...rest}
    >
      {loading && <span data-slot="spinner" aria-hidden="true" />}
      {startIcon && (
        <span data-slot="icon" aria-hidden="true">
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span data-slot="icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </StyledButton>
  );
});

Button.displayName = 'Button';
