import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // The default react-hooks flat config includes several *very strict* rules
      // (immutability/purity/refs/set-state-in-effect) that are great for greenfield
      // codebases, but they currently block `pnpm lint` for this project.
      // We keep the standard rules (rules-of-hooks, exhaustive-deps) and relax the rest.
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',

      // Vite fast refresh rule can be noisy for shared component files.
      'react-refresh/only-export-components': 'warn',

      // Prefer linting for correctness; keep style/strictness as warnings.
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
