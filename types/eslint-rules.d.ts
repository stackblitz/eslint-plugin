declare module 'eslint/lib/rules/lines-around-comment' {
  import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

  const rule: TSESLint.RuleModule<
    'after' | 'before',
    [
      {
        beforeBlockComment: boolean;
        afterBlockComment: boolean;
        beforeLineComment: boolean;
        afterLineComment: boolean;
        allowBlockStart: boolean;
        allowBlockEnd: boolean;
        allowObjectStart: boolean;
        allowObjectEnd: boolean;
        allowArrayStart: boolean;
        allowArrayEnd: boolean;
        allowClassStart: boolean;
        allowClassEnd: boolean;
        allowInterfaceStart: boolean;
        allowInterfaceEnd: boolean;
        applyDefaultIgnorePatterns: boolean;
        ignorePattern: string;
      }?
    ],
    {
      Program(node: TSESTree.Program): void;
    }
  >;
  export = rule;
}
