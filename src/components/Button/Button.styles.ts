import styled, { css, keyframes } from 'styled-components';
import type {
  ButtonAppearance,
  ButtonIntent,
  ButtonRadius,
  ButtonSize,
  ButtonTone,
  ButtonVariant,
} from './Button';

interface StyledButtonProps {
  $variant: ButtonVariant;
  $intent: ButtonIntent;
  $tone: ButtonTone;
  $appearance: ButtonAppearance;
  $size: ButtonSize;
  $radius: ButtonRadius;
  $fullWidth: boolean;
}

/** Maps the public appearance name to the token style key (Portuguese). */
const appearanceStyle: Record<ButtonAppearance, string> = {
  filled: 'preenchido',
  outlined: 'contornado',
  ghost: 'nao-preenchido',
};

type State =
  | 'normal'
  | 'sobre'
  | 'em-foco'
  | 'pressionado'
  | 'desabilitado'
  | 'carregando';
type Prop = 'bg-color' | 'label-color' | 'stroke-color' | 'icon-color' | 'sd-color';

/**
 * Builds the CSS custom property name for a button token:
 * `--button-[<tone>-]<scope>-<appearance>-<state>-<prop>`.
 *
 * `<scope>` is the visual channel for the brand intent, and the intent name
 * itself for `feedback` / `neutral` — matching how the build emits them.
 */
const v =
  ({ $tone, $intent, $variant, $appearance }: StyledButtonProps) =>
  (state: State, prop: Prop) => {
    const tone = $tone === 'default' ? '' : `${$tone}-`;
    const scope = $intent === 'brand' ? $variant : $intent;
    return `var(--button-${tone}${scope}-${appearanceStyle[$appearance]}-${state}-${prop})`;
  };

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    font-size: 14px;
    line-height: 20px;
    padding: 6px 12px;
    gap: 6px;
  `,
  md: css`
    font-size: 16px;
    line-height: 24px;
    padding: 10px 16px;
    gap: 8px;
  `,
  lg: css`
    font-size: 18px;
    line-height: 28px;
    padding: 14px 20px;
    gap: 10px;
  `,
};

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const colorStyles = (props: StyledButtonProps) => {
  const t = v(props);
  return css`
    background: ${t('normal', 'bg-color')};
    color: ${t('normal', 'label-color')};
    border-color: ${t('normal', 'stroke-color')};

    [data-slot='icon'] {
      color: ${t('normal', 'icon-color')};
    }

    &:hover:not(:disabled):not([aria-busy='true']) {
      background: ${t('sobre', 'bg-color')};
      color: ${t('sobre', 'label-color')};
      border-color: ${t('sobre', 'stroke-color')};

      [data-slot='icon'] {
        color: ${t('sobre', 'icon-color')};
      }
    }

    &:active:not(:disabled):not([aria-busy='true']) {
      background: ${t('pressionado', 'bg-color')};
      color: ${t('pressionado', 'label-color')};
      border-color: ${t('pressionado', 'stroke-color')};

      [data-slot='icon'] {
        color: ${t('pressionado', 'icon-color')};
      }
    }

    &:focus-visible {
      outline: 2px solid ${t('em-foco', 'stroke-color')};
      outline-offset: 2px;
    }

    /* Loading keeps the resting label/icon colors — the delivery only defines a
       background (filled) or a stroke (outlined/ghost) for this state. */
    &[aria-busy='true'] {
      cursor: progress;
      pointer-events: none;
      background: ${t('carregando', 'bg-color')};
      border-color: ${t('carregando', 'stroke-color')};
    }

    &:disabled {
      cursor: not-allowed;
      background: ${t('desabilitado', 'bg-color')};
      color: ${t('desabilitado', 'label-color')};
      border-color: ${t('desabilitado', 'stroke-color')};

      [data-slot='icon'] {
        color: ${t('desabilitado', 'icon-color')};
      }
    }
  `;
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: ${({ $radius }) => `var(--button-radius-${$radius})`};
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  [data-slot='icon'] {
    display: inline-flex;
    align-items: center;
  }

  [data-slot='spinner'] {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ${spin} 0.6s linear infinite;
  }

  ${({ $size }) => sizeStyles[$size]}
  ${colorStyles}
`;
