import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

const scriptFiles = ['scripts/*.js']

export default tseslint.config(
  { ignores: ['dist/*'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  { files: scriptFiles, languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    ignores: scriptFiles,
  })),
  eslintConfigPrettier,
)
