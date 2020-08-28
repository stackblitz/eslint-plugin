import blockScopeCase, { ruleName as blockScopeCaseRuleName } from './block-scope-case';
import newlineBeforeReturn, { ruleName as newlineBeforeReturnRuleName } from './newline-before-return';
import linesAroundComment, { ruleName as linesAroundCommentRuleName } from './lines-around-comment';

export = {
  [blockScopeCaseRuleName]: blockScopeCase,
  [newlineBeforeReturnRuleName]: newlineBeforeReturn,
  [linesAroundCommentRuleName]: linesAroundComment,
};
