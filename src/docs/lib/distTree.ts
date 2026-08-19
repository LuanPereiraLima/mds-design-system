// Lista os arquivos CSS reais gerados por `npm run tokens:build` em
// `src/tokens/css/` (só os caminhos, sem importar conteúdo), pra a página
// "Como o build funciona" mostrar a árvore de saída de verdade. Web-only.
const files = import.meta.glob('../../tokens/css/*.css');

/** Nomes dos arquivos CSS gerados (ex.: "mrv.light.css"), ordenados. */
export function getGeneratedCssFiles(): string[] {
  return Object.keys(files)
    .map((p) => p.slice(p.lastIndexOf('/') + 1))
    .sort();
}
