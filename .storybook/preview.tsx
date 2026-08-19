import type { Preview } from '@storybook/react';
import { BrandProvider } from '../src/theme/BrandProvider';
import type { Brand, Theme } from '../src/theme/BrandProvider';

// Load every generated token stylesheet (per brand x theme) + component tokens.
import.meta.glob('../src/tokens/css/*.css', { eager: true });

const brands: { value: Brand; title: string }[] = [
  { value: 'mrv', title: 'MRV' },
  { value: 'sensia', title: 'SENSIA' },
  { value: 'luggo', title: 'Luggo' },
  { value: 'mrvCo', title: 'MRV&CO' },
  { value: 'class', title: 'Class' },
  { value: 'mdc', title: 'MDC' },
  { value: 'urba', title: 'Urba' },
  { value: 'superApp', title: 'SuperApp' },
];

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Active brand',
      defaultValue: 'mrv',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: brands,
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Light or dark theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <BrandProvider
        brand={context.globals.brand as Brand}
        theme={context.globals.theme as Theme}
      >
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </BrandProvider>
    ),
  ],
  parameters: {
    controls: {
      expanded: true,
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
