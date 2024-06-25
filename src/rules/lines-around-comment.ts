import { AST_NODE_TYPES, AST_TOKEN_TYPES, TSESTree } from '@typescript-eslint/utils';
import { isCommentToken, isTokenOnSameLine } from '@typescript-eslint/utils/ast-utils';
import { createRule } from '../util';
import { getESLintCoreRule } from '../util/getESLintCoreRule';

export const ruleName = 'lines-around-comment';

const baseRule = getESLintCoreRule(ruleName);

const END_REGION_PRAGMA = ' #endregion';
const COMMENTS_IGNORE_PATTERN = /^\s*(?:eslint|jshint\s+|jslint\s+|istanbul\s+|globals?\s+|exported\s+|jscs)/u;

const START_END_NODES = [
  AST_NODE_TYPES.TSEnumDeclaration,
  AST_NODE_TYPES.TSEnumBody,
  AST_NODE_TYPES.SwitchStatement,
  AST_NODE_TYPES.ArrayExpression,
  AST_NODE_TYPES.ArrayPattern,
  AST_NODE_TYPES.ObjectExpression,
  AST_NODE_TYPES.TSTypeLiteral,
];

function getEmptyLineNums(lines: string[]): number[] {
  const emptyLines = lines
    .map((line, i) => {
      return {
        code: line.trim(),
        num: i + 1,
      };
    })
    .filter((line) => !line.code)
    .map((line) => line.num);

  return emptyLines;
}

function getCommentLineNums(comments: TSESTree.Comment[]): number[] {
  const lines: number[] = [];

  comments.forEach((token) => {
    const start = token.loc.start.line;
    const end = token.loc.end.line;

    lines.push(start, end);
  });

  return lines;
}

export interface BaseOptions {
  beforeBlockComment?: boolean;
  afterBlockComment?: boolean;
  beforeLineComment?: boolean;
  afterLineComment?: boolean;
  allowBlockStart?: boolean;
  allowBlockEnd?: boolean;
  allowClassStart?: boolean;
  allowClassEnd?: boolean;
  allowObjectStart?: boolean;
  allowObjectEnd?: boolean;
  allowArrayStart?: boolean;
  allowArrayEnd?: boolean;
  allowInterfaceStart?: boolean;
  allowInterfaceEnd?: boolean;
  allowTypeStart?: boolean;
  allowTypeEnd?: boolean;
  allowEnumStart?: boolean;
  allowEnumEnd?: boolean;
  allowModuleStart?: boolean;
  allowModuleEnd?: boolean;
  ignorePattern?: string;
  applyDefaultIgnorePatterns?: boolean;
  afterHashbangComment?: boolean;
}

export interface ExtendedOptions extends BaseOptions {
  allowSwitchStart?: boolean;
  allowSwitchEnd?: boolean;
  allowMemberCallExpression?: boolean;
}

export type MessageIds = 'after' | 'before';

export const defaultOptions: ExtendedOptions = {
  beforeBlockComment: true,
  afterBlockComment: false,
  beforeLineComment: true,
  afterLineComment: false,
  allowBlockStart: false,
  allowBlockEnd: false,
  allowClassStart: false,
  allowClassEnd: false,
  allowObjectStart: false,
  allowObjectEnd: false,
  allowArrayStart: false,
  allowArrayEnd: false,
  allowInterfaceStart: false,
  allowInterfaceEnd: false,
  allowTypeStart: false,
  allowTypeEnd: false,
  allowEnumStart: false,
  allowEnumEnd: false,
  allowModuleStart: false,
  allowModuleEnd: false,
  allowSwitchStart: false,
  allowSwitchEnd: false,
  allowMemberCallExpression: false,
  ignorePattern: '',
  applyDefaultIgnorePatterns: false,
};

type Options = [typeof defaultOptions];

export default createRule<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'layout',
    docs: {
      description: 'Require empty lines around comments',
    },
    schema: [
      {
        type: 'object',
        properties: {
          beforeBlockComment: {
            type: 'boolean',
            default: true,
          },
          afterBlockComment: {
            type: 'boolean',
            default: false,
          },
          beforeLineComment: {
            type: 'boolean',
            default: false,
          },
          afterLineComment: {
            type: 'boolean',
            default: false,
          },
          allowBlockStart: {
            type: 'boolean',
            default: false,
          },
          allowBlockEnd: {
            type: 'boolean',
            default: false,
          },
          allowClassStart: {
            type: 'boolean',
          },
          allowClassEnd: {
            type: 'boolean',
          },
          allowObjectStart: {
            type: 'boolean',
          },
          allowObjectEnd: {
            type: 'boolean',
          },
          allowArrayStart: {
            type: 'boolean',
          },
          allowArrayEnd: {
            type: 'boolean',
          },
          allowInterfaceStart: {
            type: 'boolean',
          },
          allowInterfaceEnd: {
            type: 'boolean',
          },
          allowTypeStart: {
            type: 'boolean',
          },
          allowTypeEnd: {
            type: 'boolean',
          },
          allowEnumStart: {
            type: 'boolean',
          },
          allowEnumEnd: {
            type: 'boolean',
          },
          allowModuleStart: {
            type: 'boolean',
          },
          allowModuleEnd: {
            type: 'boolean',
          },
          allowSwitchStart: {
            type: 'boolean',
          },
          allowSwitchEnd: {
            type: 'boolean',
          },
          allowMemberCallExpression: {
            type: 'boolean',
          },
          ignorePattern: {
            type: 'string',
          },
          applyDefaultIgnorePatterns: {
            type: 'boolean',
          },
          afterHashbangComment: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: baseRule.meta.fixable,
    messages: baseRule.meta.messages,
    hasSuggestions: baseRule.meta.hasSuggestions,
  },
  defaultOptions: [defaultOptions],
  create(context, [options]) {
    const { sourceCode } = context;
    const comments = sourceCode.getAllComments();

    const lines = sourceCode.lines;
    const commentLines = getCommentLineNums(comments);
    const emptyLines = getEmptyLineNums(lines);
    const commentAndEmptyLines = new Set(commentLines.concat(emptyLines));

    const defaultIgnoreRegExp = COMMENTS_IGNORE_PATTERN;
    const customIgnoreRegExp = new RegExp(options.ignorePattern ?? '', 'u');

    function getParentNodeOfToken(token: TSESTree.Token) {
      return sourceCode.getNodeByRangeIndex(token.range[0]);
    }

    function isParentNodeType(parent: TSESTree.Node | null, nodeType: AST_NODE_TYPES) {
      return parent && parent.type === nodeType;
    }

    function isCommentAtParentStart(token: TSESTree.Token, nodeType: AST_NODE_TYPES) {
      const parent = getParentNodeOfToken(token);
      return parent && isParentNodeType(parent, nodeType) && token.loc.start.line - parent.loc.start.line === 1;
    }

    function isCommentAtParentEnd(token: TSESTree.Token, nodeType: AST_NODE_TYPES) {
      const parent = getParentNodeOfToken(token);
      return parent && isParentNodeType(parent, nodeType) && parent.loc.end.line - token.loc.end.line === 1;
    }

    function isMemberExpression(node: TSESTree.Node | null, objectType: AST_NODE_TYPES) {
      if (node == null) {
        return false;
      }

      return node.type === AST_NODE_TYPES.MemberExpression && node.object.type === objectType;
    }

    function codeAroundComment(token: TSESTree.Token): boolean {
      let currentToken: TSESTree.Token | null = token;

      do {
        currentToken = sourceCode.getTokenBefore(currentToken, {
          includeComments: true,
        });
      } while (currentToken && isCommentToken(currentToken));

      if (currentToken && isTokenOnSameLine(currentToken, token)) {
        return true;
      }

      currentToken = token;

      do {
        currentToken = sourceCode.getTokenAfter(currentToken, {
          includeComments: true,
        });
      } while (currentToken && isCommentToken(currentToken));

      if (currentToken && isTokenOnSameLine(token, currentToken)) {
        return true;
      }

      return false;
    }

    function isEndRegionPragma(token: TSESTree.Comment) {
      return token.type === AST_TOKEN_TYPES.Line && token.value === END_REGION_PRAGMA;
    }

    function shouldHandleComment(token: TSESTree.Comment) {
      const isKnownParentNode = [AST_NODE_TYPES.MemberExpression, AST_NODE_TYPES.IfStatement].some(
        (nodeType) => getParentNodeOfToken(token)?.type === nodeType
      );

      const isNearStartOrEndOfKnownNode = START_END_NODES.some((nodeType) => {
        return isCommentAtParentStart(token, nodeType) || isCommentAtParentEnd(token, nodeType);
      });

      return isEndRegionPragma(token) || isKnownParentNode || isNearStartOrEndOfKnownNode;
    }

    function checkForEmptyLine(token: TSESTree.Comment, { before, after }: { before?: boolean; after?: boolean }) {
      if (!shouldHandleComment(token)) {
        return;
      }

      if (options.applyDefaultIgnorePatterns !== false && defaultIgnoreRegExp.test(token.value)) {
        return;
      }

      if (options.ignorePattern && customIgnoreRegExp.test(token.value)) {
        return;
      }

      if (isEndRegionPragma(token) && before) {
        return;
      }

      if (codeAroundComment(token)) {
        return;
      }

      const parentNode = getParentNodeOfToken(token);

      // we always allow comments in an if-statement
      if (parentNode?.type === AST_NODE_TYPES.IfStatement) {
        return;
      }

      const prevLineNum = token.loc.start.line - 1;
      const nextLineNum = token.loc.end.line + 1;

      const previousTokenOrComment = sourceCode.getTokenBefore(token, {
        includeComments: true,
      });

      const nextTokenOrComment = sourceCode.getTokenAfter(token, {
        includeComments: true,
      });

      const _report = (messageId: MessageIds) => {
        const lineStart = token.range[0] - token.loc.start.column;
        const range = [lineStart, lineStart] as const;

        context.report({
          node: token,
          messageId,
          fix(fixer) {
            return fixer.insertTextBeforeRange(range, '\n');
          },
        });
      };

      const isAtStart = START_END_NODES.some((nodeType) => isCommentAtParentStart(token, nodeType));
      const isAtEnd = START_END_NODES.some((nodeType) => isCommentAtParentEnd(token, nodeType));

      const isStartAllowed =
        options.allowEnumStart ||
        options.allowSwitchStart ||
        options.allowArrayStart ||
        options.allowObjectStart ||
        options.allowTypeStart;

      const isEndAllowed =
        options.allowEnumEnd ||
        options.allowSwitchEnd ||
        options.allowArrayEnd ||
        options.allowObjectEnd ||
        options.allowTypeEnd;

      const isPrevLineEmpty = commentAndEmptyLines.has(prevLineNum);
      const isNextLineEmpty = commentAndEmptyLines.has(nextLineNum);

      const isPrevTokenOnSameLine =
        isCommentToken(previousTokenOrComment!) && isTokenOnSameLine(previousTokenOrComment, token);

      const isNextTokenOnSameLine = isCommentToken(nextTokenOrComment!) && isTokenOnSameLine(token, nextTokenOrComment);

      if (isAtStart) {
        if (!isStartAllowed && !isPrevLineEmpty && !isPrevTokenOnSameLine) {
          _report('before');
        }
      } else if (
        isMemberExpression(parentNode, AST_NODE_TYPES.CallExpression) ||
        isMemberExpression(parentNode, AST_NODE_TYPES.Identifier)
      ) {
        if (!options.allowMemberCallExpression) {
          _report('before');
        }
      } else if (before && !isPrevLineEmpty) {
        _report('before');
      }

      if (isAtEnd) {
        if (!isEndAllowed && !isNextLineEmpty && !isNextTokenOnSameLine) {
          _report('after');
        }
      } else if (after && !isNextLineEmpty) {
        _report('after');
      }
    }

    const customReport: typeof context.report = (descriptor) => {
      if ('node' in descriptor) {
        if (descriptor.node.type === AST_TOKEN_TYPES.Line || descriptor.node.type === AST_TOKEN_TYPES.Block) {
          if (shouldHandleComment(descriptor.node)) {
            return undefined;
          }
        }
      }

      return context.report(descriptor);
    };

    const customContext = { report: customReport };

    /**
     * We can't directly proxy `context` because its `report` property is non-configurable
     * and non-writable. So we proxy `customContext` and redirect all
     * property access to the original context except for `report`.
     */
    const proxiedContext = new Proxy<typeof context>(customContext as typeof context, {
      get(target, path, receiver): unknown {
        if (path !== 'report') {
          return Reflect.get(context, path, receiver);
        }

        return Reflect.get(target, path, receiver);
      },
    });

    const rule = baseRule.create(proxiedContext);

    return {
      Program: (node) => {
        rule.Program?.(node);

        comments.forEach((token) => {
          if (token.type === AST_TOKEN_TYPES.Line) {
            if (options.beforeLineComment || options.afterLineComment) {
              checkForEmptyLine(token, {
                after: options.afterLineComment,
                before: options.beforeLineComment,
              });
            }
          } else if (token.type === AST_TOKEN_TYPES.Block) {
            if (options.beforeBlockComment || options.afterBlockComment) {
              checkForEmptyLine(token, {
                after: options.afterBlockComment,
                before: options.beforeBlockComment,
              });
            }
          }
        });
      },
    };
  },
});
