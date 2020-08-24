import blockScopeCase, { ruleName as blockScopeCaseRuleName } from './block-scope-case';
import newlineBeforeReturn, { ruleName as newlineBeforeReturnRuleName } from './newline-before-return';

export = {
  [blockScopeCaseRuleName]: blockScopeCase,
  [newlineBeforeReturnRuleName]: newlineBeforeReturn,
};
