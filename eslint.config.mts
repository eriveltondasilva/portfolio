import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import importPlugin from 'eslint-plugin-import'

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
      // '@next/next/no-img-element': 'warn',
    },
  },

  // # Import plugin
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],

          'newlines-between': 'always',
        },
      ],

      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'import/newline-after-import': 'error',
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
  ]),
])

export default eslintConfig
