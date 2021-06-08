import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import baseRule from 'eslint/lib/rules/lines-around-comment';
import { createRule, InferMessageIdsTypeFromRule, InferOptionsTypeFromRule } from '../util';

export const ruleName = 'lines-around-comment';

export type Options = InferOptionsTypeFromRule<typeof baseRule>;
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
  allowInterfaceStart: false,
  allowInterfaceEnd: false,
  applyDefaultIgnorePatterns: false,
  ignorePattern: '',
};

export default createRule<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'layout',
    docs: {
      description: 'Require empty lines around comments',
      category: 'Stylistic Issues',
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
          allowInterfaceStart: {
            type: 'boolean',
            default: true,
          },
          allowInterfaceEnd: {
            type: 'boolean',
            default: true,
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
          ignorePattern: {
            type: 'string',
          },
          applyDefaultIgnorePatterns: {
            type: 'boolean',
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

    const allowInterfaceStart = options?.allowInterfaceStart;
    const allowInterfaceEnd = options?.allowInterfaceEnd;
    const allowObjectStart = options?.allowObjectStart;
    const allowObjectEnd = options?.allowObjectEnd;

    const rules = baseRule.create(
      Object.create(context, {
        report: {
          enumerable: true,
          value(descriptor: TSESLint.ReportDescriptor<MessageIds> & { node: TSESTree.Token }) {
            const parentNode = getParentNodeOfToken(descriptor.node);

            if (
              (parentNode && parentNode.type === 'CallExpression') ||
              (isCommentAtParentStart(descriptor.node, AST_NODE_TYPES.TSInterfaceBody) && allowInterfaceStart) ||
              (isCommentAtParentEnd(descriptor.node, AST_NODE_TYPES.TSInterfaceBody) && allowInterfaceEnd) ||
              (isCommentAtParentStart(descriptor.node, AST_NODE_TYPES.TSTypeLiteral) && allowObjectStart) ||
              (isCommentAtParentEnd(descriptor.node, AST_NODE_TYPES.TSTypeLiteral) && allowObjectEnd)
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
