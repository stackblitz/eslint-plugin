import { AST_NODE_TYPES, ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createRule, InferMessageIdsTypeFromRule, InferOptionsTypeFromRule } from '../util';

export const ruleName = 'lines-around-comment';

const baseRule = ESLintUtils.nullThrows(
  require('eslint/use-at-your-own-risk').builtinRules.get(ruleName),
  ''
) as typeof import('eslint/lib/rules/lines-around-comment');

export type BaseOptions = InferOptionsTypeFromRule<typeof baseRule>;
export type MessageIds = InferMessageIdsTypeFromRule<typeof baseRule>;

export const defaultOptions = {
  beforeBlockComment: true,
  afterBlockComment: false,
  beforeLineComment: false,
  afterLineComment: false,
  allowBlockStart: false,
  allowBlockEnd: false,
  allowObjectStart: false,
  allowObjectEnd: false,
  allowArrayStart: false,
  allowArrayEnd: false,
  allowClassStart: false,
  allowClassEnd: false,
  allowEnumStart: false,
  allowEnumEnd: false,
  allowSwitchStart: false,
  allowSwitchEnd: false,
  allowInterfaceStart: false,
  allowInterfaceEnd: false,
  allowMemberCallExpression: false,
  applyDefaultIgnorePatterns: false,
  ignorePattern: '',
};

type Options = [(typeof defaultOptions | undefined)?];

export default createRule<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'layout',
    docs: {
      description: 'Require empty lines around comments',
      recommended: false,
      extendsBaseRule: true,
      requiresTypeChecking: true,
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
          allowSwitchStart: {
            type: 'boolean',
            default: false,
          },
          allowSwitchEnd: {
            type: 'boolean',
            default: false,
          },
          allowEnumStart: {
            type: 'boolean',
            default: false,
          },
          allowEnumEnd: {
            type: 'boolean',
            default: false,
          },
          allowInterfaceStart: {
            type: 'boolean',
            default: false,
          },
          allowInterfaceEnd: {
            type: 'boolean',
            default: false,
          },
          allowClassStart: {
            type: 'boolean',
            default: false,
          },
          allowClassEnd: {
            type: 'boolean',
            default: false,
          },
          allowObjectStart: {
            type: 'boolean',
            default: false,
          },
          allowObjectEnd: {
            type: 'boolean',
            default: false,
          },
          allowArrayStart: {
            type: 'boolean',
            default: false,
          },
          allowArrayEnd: {
            type: 'boolean',
            default: false,
          },
          allowMemberCallExpression: {
            type: 'boolean',
            default: false,
          },
          ignorePattern: {
            type: 'string',
          },
          applyDefaultIgnorePatterns: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: baseRule.meta.fixable,
    messages: baseRule.meta.messages,
  },
  defaultOptions: [defaultOptions],
  create(context, [options]) {
    const sourceCode = context.getSourceCode();

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

    const allowSwitchStart = options?.allowSwitchStart;
    const allowSwitchEnd = options?.allowSwitchEnd;
    const allowEnumStart = options?.allowEnumStart;
    const allowEnumEnd = options?.allowEnumEnd;
    const allowInterfaceStart = options?.allowInterfaceStart;
    const allowInterfaceEnd = options?.allowInterfaceEnd;
    const allowObjectStart = options?.allowObjectStart;
    const allowObjectEnd = options?.allowObjectEnd;
    const allowMemberCallExpression = options?.allowMemberCallExpression;

    const rules = baseRule.create(
      Object.create(context, {
        report: {
          enumerable: true,
          value(descriptor: TSESLint.ReportDescriptor<MessageIds> & { node: TSESTree.Token }) {
            const parentNode = getParentNodeOfToken(descriptor.node);

            if (
              (parentNode && parentNode.type === 'CallExpression') ||
              (isCommentAtParentStart(descriptor.node, AST_NODE_TYPES.SwitchStatement) && allowSwitchStart) ||
              (isCommentAtParentEnd(descriptor.node, AST_NODE_TYPES.SwitchStatement) && allowSwitchEnd) ||
              (isCommentAtParentStart(descriptor.node, AST_NODE_TYPES.TSEnumDeclaration) && allowEnumStart) ||
              (isCommentAtParentEnd(descriptor.node, AST_NODE_TYPES.TSEnumDeclaration) && allowEnumEnd) ||
              (isCommentAtParentStart(descriptor.node, AST_NODE_TYPES.TSInterfaceBody) && allowInterfaceStart) ||
              (isCommentAtParentEnd(descriptor.node, AST_NODE_TYPES.TSInterfaceBody) && allowInterfaceEnd) ||
              (isCommentAtParentStart(descriptor.node, AST_NODE_TYPES.TSTypeLiteral) && allowObjectStart) ||
              (isCommentAtParentEnd(descriptor.node, AST_NODE_TYPES.TSTypeLiteral) && allowObjectEnd) ||
              ((isMemberExpression(parentNode, AST_NODE_TYPES.CallExpression) ||
                isMemberExpression(parentNode, AST_NODE_TYPES.Identifier)) &&
                allowMemberCallExpression)
            ) {
              return;
            }

            context.report(descriptor);
          },
        },
      })
    );

    return {
      Program: (node) => {
        rules.Program(node);
      },
    };
  },
});
