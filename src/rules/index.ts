import blockScopeCase, { ruleName as blockScopeCaseRuleName } from './block-scope-case';
import catchErrorName, { ruleName as catchErrorNameRuleName } from './catch-error-name';
import commentSyntaxRule, { ruleName as commentSyntaxRuleName } from './comment-syntax';
import linesAroundComment, { ruleName as linesAroundCommentRuleName } from './lines-around-comment';
import newlineBeforeReturn, { ruleName as newlineBeforeReturnRuleName } from './newline-before-return';

export const rules = {
  [blockScopeCaseRuleName]: blockScopeCase,
  [newlineBeforeReturnRuleName]: newlineBeforeReturn,
  [linesAroundCommentRuleName]: linesAroundComment,
  [catchErrorNameRuleName]: catchErrorName,
  [commentSyntaxRuleName]: commentSyntaxRule,
};
