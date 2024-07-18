import stylisticTS from '@stylistic/eslint-plugin-ts';
import * as tsParser from '@typescript-eslint/parser';
import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint';
import pluginImport from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import { rules as blitzRules } from '../rules';
import { jsFileExtensions, jsRules } from './javascript';
import { jsonConfigs } from './json';
import { tsFileExtensions, tsRules, type TSRuleExtensions } from './typescript';
import { getFiles } from './utils';

interface RuleExtensions {
  ts?: TSRuleExtensions;
}

export function recommended(extenions?: RuleExtensions): FlatConfig.ConfigArray {
  return [
    eslintPluginPrettierRecommended,
    ...jsonConfigs,
    ...tseslint.configs.recommended.map((config) => {
      return {
        ...config,
        files: getFiles(config, tsFileExtensions),
      };
    }),
    {
      name: 'blitz/recommended-js',
      files: jsFileExtensions,
      ...tseslint.configs.disableTypeChecked,
      plugins: {
        '@blitz': {
          rules: blitzRules,
        },
      },
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
      },
      rules: {
        ...jsRules,
      },
    },
    {
      name: 'blitz/recommended-ts',
      files: tsFileExtensions,
      plugins: {
        '@stylistic/ts': stylisticTS,
        '@blitz': {
          rules: blitzRules,
        },
      },
      rules: {
        ...tsRules(extenions?.ts),
      },
    },
    {
      plugins: {
        import: pluginImport,
      },
      rules: {
        // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md
        'import/order': ['error', { alphabetize: { order: 'asc' } }],
      },
    },
  ];
}
