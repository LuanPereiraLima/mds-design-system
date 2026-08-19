import { useEffect, useRef, useState } from 'react';
import { addons } from 'storybook/internal/preview-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';

/** As marcas cobertas pelo Design System (mesma ordem da toolbar). */
export const BRANDS = [
  { key: 'mrv', label: 'MRV' },
  { key: 'sensia', label: 'SENSIA' },
  { key: 'luggo', label: 'Luggo' },
  { key: 'mrvCo', label: 'MRV&CO' },
  { key: 'class', label: 'Class' },
  { key: 'mdc', label: 'MDC' },
  { key: 'urba', label: 'Urba' },
  { key: 'superApp', label: 'SuperApp' },
] as const;

/** Os modos de tema disponíveis. */
export const MODES = ['light', 'dark'] as const;

const DEFAULT_BRAND = 'mrv';
const DEFAULT_MODE = 'light';

/** camelCase -> nome da CSS custom property gerada pelo build
 * (ex.: `onPrimary` -> `--on-primary`). */
export const cssVar = (name: string) => `--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

interface GlobalsEvent {
  globals?: Record<string, unknown>;
}

/**
 * Lê a marca/modo ativos direto dos globals da toolbar do Storybook, reagindo
 * às trocas em tempo real via canal de eventos.
 *
 * Não existe mais camada de dados: as páginas leem os valores finais das CSS
 * custom properties já geradas em `src/tokens/css/` (carregadas globalmente
 * pelo preview), então o hook só precisa expor qual marca/modo está ativo.
 */
export function useBrandTheme() {
  const [brand, setBrand] = useState<string>(DEFAULT_BRAND);
  const [mode, setMode] = useState<string>(DEFAULT_MODE);

  useEffect(() => {
    let channel: ReturnType<typeof addons.getChannel>;
    try {
      channel = addons.getChannel();
    } catch {
      return;
    }
    const apply = ({ globals }: GlobalsEvent) => {
      if (globals?.brand) setBrand(String(globals.brand));
      if (globals?.theme) setMode(String(globals.theme));
    };
    // Semeia o estado com os globals já emitidos ANTES da montagem: o Storybook
    // dispara SET_GLOBALS na inicialização, normalmente antes deste componente
    // assinar o canal. Sem isto, a página fica travada no default (mrv/light)
    // até a próxima troca na toolbar. `channel.last(...)` devolve o último
    // payload de cada evento.
    const seed =
      (channel.last?.(GLOBALS_UPDATED)?.[0] as GlobalsEvent | undefined) ??
      (channel.last?.(SET_GLOBALS)?.[0] as GlobalsEvent | undefined);
    if (seed) apply(seed);

    channel.on(SET_GLOBALS, apply);
    channel.on(GLOBALS_UPDATED, apply);
    return () => {
      channel.off(SET_GLOBALS, apply);
      channel.off(GLOBALS_UPDATED, apply);
    };
  }, []);

  return { brand, mode };
}

/**
 * Lê o valor computado de uma lista de CSS custom properties (`--nome`) a
 * partir de um elemento, reagindo à marca/modo ativos. Devolve um `ref` que
 * deve ser posto no elemento onde os valores são resolvidos — assim páginas de
 * tipografia (escopo `[data-brand]`) ou de papéis semânticos (escopo
 * `[data-visual]` etc.) podem ler os valores no contexto certo.
 */
export function useCssValues(varNames: string[]) {
  const { brand, mode } = useBrandTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const key = varNames.join('|');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const styles = getComputedStyle(el);
    const next: Record<string, string> = {};
    for (const name of varNames) {
      const value = styles.getPropertyValue(name).trim();
      if (value) next[name] = value;
    }
    setValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, mode, key]);

  return { ref, values, brand, mode };
}
