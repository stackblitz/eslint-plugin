import blockScopeCase, { ruleName as blockScopeCaseRuleName } from './block-scope-case';
import catchErrorName, { ruleName as catchErrorNameRuleName } from './catch-error-name';
import linesAroundComment, { ruleName as linesAroundCommentRuleName } from './lines-around-comment';
import newlineBeforeReturn, { ruleName as newlineBeforeReturnRuleName } from './newline-before-return';
import commentRule, { ruleName as commentRuleName } from './comment';

export = {
  [blockScopeCaseRuleName]: blockScopeCase,
  [newlineBeforeReturnRuleName]: newlineBeforeReturn,
  [linesAroundCommentRuleName]: linesAroundComment,
  [catchErrorNameRuleName]: catchErrorName,
  [commentRuleName]: commentRule,
};
