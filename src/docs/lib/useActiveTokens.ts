import { useEffect, useState } from 'react';
import { addons } from 'storybook/internal/preview-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { getCss, getTokens } from './tokens';

export const DEFAULT_BRAND = 'mrv';
export const DEFAULT_MODE = 'light';

// O payload real de `globalsUpdated`/`setGlobals` (confirmado inspecionando o
// canal em runtime) é `{ initialGlobals, userGlobals }` — os valores atuais
// (já refletindo a troca feita na toolbar) ficam em `userGlobals`, não em
// `globals` como a assinatura de tipos sugeriria.
type GlobalsPayload = { userGlobals?: Record<string, unknown> };

declare global {
  interface Window {
    __STORYBOOK_PREVIEW__?: {
      storyStoreValue?: { userGlobals?: { globals?: Record<string, unknown> } };
    };
  }
}

function readCurrentGlobals(): Record<string, unknown> {
  return window.__STORYBOOK_PREVIEW__?.storyStoreValue?.userGlobals?.globals ?? {};
}

/** Lê marca/modo ativos na toolbar do Storybook e resolve os tokens/CSS
 * correspondentes.
 *
 * Não usamos o hook `useGlobals` de `storybook/preview-api` porque ele só
 * funciona dentro de uma story/decorator — em página MDX pura (sem
 * `<Story>`), o componente roda fora desse ciclo e o hook lança "Storybook
 * preview hooks can only be called inside decorators and story functions".
 * Em vez disso: lemos o estado atual direto de `window.__STORYBOOK_PREVIEW__`
 * pro valor inicial, e escutamos o canal (`GLOBALS_UPDATED`/`SET_GLOBALS`)
 * pras trocas seguintes — tudo com `useState`/`useEffect` normais do React,
 * que não têm essa restrição. */
export function useActiveTokens() {
  const [globals, setGlobals] = useState<Record<string, unknown>>(readCurrentGlobals);

  useEffect(() => {
    let channel: ReturnType<typeof addons.getChannel> | undefined;
    try {
      channel = addons.getChannel();
    } catch {
      return;
    }
    if (!channel) return;
    const onUpdate = (payload: GlobalsPayload) => {
      if (payload?.userGlobals) setGlobals(payload.userGlobals);
    };
    channel.on(SET_GLOBALS, onUpdate);
    channel.on(GLOBALS_UPDATED, onUpdate);
    return () => {
      channel.off(SET_GLOBALS, onUpdate);
      channel.off(GLOBALS_UPDATED, onUpdate);
    };
  }, []);

  const brand = (globals.brand as string) ?? DEFAULT_BRAND;
  const mode = (globals.theme as string) ?? (globals.mode as string) ?? DEFAULT_MODE;
  const css = getCss(brand, mode);

  // Mantém uma <style> global no <head> com o CSS da combinação ativa, pra
  // qualquer coisa na doc que use var(--mds-*) reagir à troca de marca/modo,
  // mesmo fora de componentes que chamam este hook diretamente.
  useEffect(() => {
    let tag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
    if (!tag) {
      tag = document.createElement('style');
      tag.id = STYLE_TAG_ID;
      document.head.appendChild(tag);
    }
    tag.textContent = css;
  }, [css]);

  return {
    brand,
    mode,
    tokens: getTokens(brand, mode),
    css,
  };
}

const STYLE_TAG_ID = 'mds-active-tokens-css';
