import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import importXPlugin from 'eslint-plugin-import-x';
import { defineConfig, globalIgnores } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // # Prettier desativa regras conflitantes
  prettier,

  // # Custom rules
  {
    rules: {
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      'react/no-unescaped-entities': 'off',
    },
  },

  // # Import plugin
  {
    plugins: {
      'import-x': importXPlugin,
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },
    rules: {
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],

          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin', 'type'],

          'newlines-between': 'always',
        },
      ],

      'import-x/no-duplicates': 'error',
      'import-x/newline-after-import': 'error',
    },
  },

  // # Global ignores
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Custom ignores:
    'src/components/ui/**',
    'generated/**',
  ]),
]);

export default eslintConfig;
