import { FlatConfig } from '@typescript-eslint/utils/ts-eslint';
import { jsRules } from './javascript';

export interface TSRuleExtensions {
  namingConvention?: {
    variable?: {
      exceptions?: string[];
    };
  };
}

export const tsFileExtensions = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];

export function getNamingConventionRule(
  extensions?: TSRuleExtensions['namingConvention'],
  tsx = false,
): FlatConfig.Config['rules'] {
  return {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['variable', 'function'],
        format: ['camelCase', 'UPPER_CASE', tsx && 'StrictPascalCase'].filter(Boolean),
        leadingUnderscore: 'allowSingleOrDouble',
        trailingUnderscore: 'forbid',
        filter: {
          regex: generateNamingConventionRegex(['__dirname'], extensions?.variable?.exceptions),
          match: false,
        },
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
    ],
  };
}

export function tsRules(extensions?: TSRuleExtensions): FlatConfig.Config['rules'] {
  return {
    ...jsRules,

    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

    '@typescript-eslint/no-non-null-assertion': 'off',

    '@typescript-eslint/no-empty-function': 'warn',

    '@typescript-eslint/no-explicit-any': 'off',

    ...getNamingConventionRule(extensions?.namingConvention, false),

    '@typescript-eslint/explicit-module-boundary-types': 'off',

    '@typescript-eslint/no-extra-non-null-assertion': 'error',

    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',

    '@stylistic/ts/type-annotation-spacing': 'error',

    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public',
      },
    ],

    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': true,
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': true,
        'ts-check': false,
      },
    ],

    '@stylistic/ts/lines-around-comment': 'off',
  };
}

function generateNamingConventionRegex(defaults: string[], extensions: string[] = []) {
  return `^(${defaults.concat(extensions).join('|')})$`;
}
