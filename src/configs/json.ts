import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint';
import eslintPluginJSONC from 'eslint-plugin-jsonc';
import commentSyntaxRule, { ruleName as commentSyntaxRuleName } from '../rules/comment-syntax';
import linesAroundCommentRule, { ruleName as linesAroundCommentRuleName } from '../rules/lines-around-comment';
import { getFiles } from './utils';

export const jsonFileExtensions = ['**/*.json', '**/*.json', '*.json5', '**/*.json5', '*.jsonc', '**/*.jsonc'];

export const jsonConfigs = [
  ...eslintPluginJSONC.configs['flat/recommended-with-jsonc'].map((config) => {
    return {
      ...config,
      files: getFiles(config, jsonFileExtensions),
    };
  }),
  {
    name: 'blitz/recommended-jsonc',
    files: jsonFileExtensions,
    plugins: {
      '@blitz': {
        rules: {
          [linesAroundCommentRuleName]: linesAroundCommentRule,
          [commentSyntaxRuleName]: commentSyntaxRule,
        },
      },
    },
    rules: {
      '@blitz/comment-syntax': 'error',
      '@blitz/lines-around-comment': [
        'error',
        {
          beforeBlockComment: true,
          beforeLineComment: true,
        },
      ],
    },
  },
] satisfies FlatConfig.ConfigArray;
