import type { Rule } from 'eslint';
import type { CallExpression, Expression, SpreadElement } from 'estree';

const getFuncName = (node: CallExpression & Rule.NodeParentExtension) => {
  if (node.callee.type === 'Identifier') {
    return node.callee.name;
  }
  return null;
};

const getFuncArgs = (node: CallExpression & Rule.NodeParentExtension) => {
  if (node.arguments.length === 0) {
    return [];
  }
  return node.arguments;
};

const getFuncFirstArg = (node: CallExpression & Rule.NodeParentExtension): Expression | SpreadElement | null => node.arguments[0] ?? null;

const getFuncArgLoc = (node: CallExpression & Rule.NodeParentExtension) => {
  const funcArgs = getFuncArgs(node);
  const start = funcArgs[0]?.loc?.start ?? node.loc?.start;
  const end = funcArgs[funcArgs.length - 1]?.loc?.end ?? node.loc?.end;

  return { start, end };
};

const checkArgsLength = (
  context: Rule.RuleContext,
  node: CallExpression & Rule.NodeParentExtension,
  expectedArgsLength: number
) => {
  const funcName = getFuncName(node);
  const funcArgs = getFuncArgs(node);
  const { start, end } = getFuncArgLoc(node);

  if (funcArgs.length !== expectedArgsLength) {
    const message = `"${funcName}" only accepts ${expectedArgsLength} argument${expectedArgsLength > 1 ? 's' : ''}, but here you provide ${funcArgs.length} argument${funcArgs.length > 1 ? 's' : ''}.`;

    if (start && end) {
      context.report({
        node,
        loc: { start, end },
        message
      });
    } else {
      context.report({ node, message });
    }
  }
};

const checkArgsLiteral = (
  context: Rule.RuleContext,
  node: CallExpression & Rule.NodeParentExtension
) => {
  const funcName = getFuncName(node);
  for (const arg of getFuncArgs(node)) {
    if (arg.type !== 'Literal') {
      context.report({
        node: arg,
        message: `"${funcName}" only accepts "Literal" ("boolean", "string" or "number") argument. Did you forget to wrap it in quotes?`
      });
    }
  }
};

const checkArgsNonLiteral = (
  context: Rule.RuleContext,
  node: CallExpression & Rule.NodeParentExtension
) => {
  const funcName = getFuncName(node);
  for (const arg of getFuncArgs(node)) {
    if (arg.type === 'Literal') {
      context.report({
        node: arg,
        message: `"${funcName}" only accepts non Literal argument. It usually means you should use a bindable function here.`
      });
    }
  }
};

const USE_ACCEPTED_ARGS = new Set([...'1234567890'.split(''), 'p', 's1', 's2', 's3', 's4', 's5', 's6', 'n1', 'n2', 'n3', 'n5', 'n6']);
const TOGGLE_ACCEPTED_ARGS = new Set(['Attack', 'Focus', 'Defend', 'Spirit'].map(s => s.toLowerCase()));
const NO_ARG_FUNCNAME = new Set(['Nothing', 'NextRound', 'ToggleHover', 'Drops', 'CursorUp', 'CursorDown', 'CursorTarget', 'CursorHover', 'ClearTarget', 'Settings']);

export const MonsterbationESLintRules: {
  [name: string]: Rule.RuleModule
} = {
  'monsterbation': {
    meta: {
      type: 'problem',
      docs: {
        description: 'enforce the correct usage of Monsterbation\'s bindable function.'
      },
      messages: {}
    },
    create(context) {
      return {
        CallExpression(node) {
          const funcName = getFuncName(node);
          if (funcName && NO_ARG_FUNCNAME.has(funcName)) {
            checkArgsLength(context, node, 0);
          } else if (funcName === 'Use') {
            checkArgsLength(context, node, 1);
            checkArgsLiteral(context, node);

            const arg = getFuncFirstArg(node);
            if (arg && arg.type === 'Literal') {
              if (
                !(
                  (typeof arg.value === 'number' && arg.value >= 1 && arg.value <= 15)
                  || (typeof arg.value === 'string' && USE_ACCEPTED_ARGS.has(arg.value))
                )
              ) {
                context.report({
                  message: `"${arg.value}" is not a valid argument of "Use". Accepted argument is one of 1~15, p, s1, s2, s3, s4, s5, s6, n1, n2, n3, n5, n6.`,
                  node: arg
                });
              }
            }
          } else if (funcName === 'Toggle') {
            checkArgsLength(context, node, 1);
            checkArgsLiteral(context, node);

            const arg = getFuncFirstArg(node);
            if (arg && arg.type === 'Literal') {
              if (
                !(
                  typeof arg.value === 'string'
                  && TOGGLE_ACCEPTED_ARGS.has(arg.value.toLowerCase())
                )
              ) {
                context.report({
                  message: `"${arg.value}" is not a valid argument of "Toggle". Accepted argument is one of "Attack", "Focus", "Defend" or "Spirit", case insensitive.`,
                  node: arg
                });
              }
            }
          } else if (funcName === 'Cast') {
            checkArgsLength(context, node, 1);
          } else if (funcName === 'TargetMonster') {
            checkArgsLength(context, node, 1);
            checkArgsLiteral(context, node);
            const arg = getFuncFirstArg(node);
            if (arg && arg.type === 'Literal') {
              if (
                !(
                  typeof arg.value === 'number' && arg.value >= 0 && arg.value <= 9
                )
              ) {
                context.report({
                  message: `"${arg.value}" is not a valid argument of "TargetMonster". Accepted argument is one of 0~9.`,
                  node: arg
                });
              }
            }
          } else if (funcName === 'Strongest') {
            const funcArgs = getFuncArgs(node);
            const { start, end } = getFuncArgLoc(node);
            if (funcArgs.length !== 1) {
              const message = `"Strongest" only accepts an array as an argument, but here you provide ${funcArgs.length} argument${funcArgs.length > 1 ? 's' : ''}. Did you forget to wrap it in a pair of brackets?`;

              if (start && end) {
                context.report({
                  node,
                  loc: { start, end },
                  message
                });
              } else {
                context.report({ node, message });
              }
            } else {
              const arg = getFuncFirstArg(node);
              if (arg) {
                if (arg.type !== 'ArrayExpression') {
                  context.report({
                    node,
                    message: '"Strongest" only accepts an array as an argument. Did you forget to wrap it in a pair of brackets?'
                  });
                } else {
                  for (const element of arg.elements) {
                    if (element?.type === 'Literal') {
                      context.report({
                        node: element,
                        message: '"Strongest" only accepts an array of functions as its argument. You should only use bindable actions here.'
                      });
                    }
                  }
                }
              }
            }
          } else if (funcName === 'HoverAction') {
            const funcArgs = getFuncArgs(node);
            const { start, end } = getFuncArgLoc(node);
            if (!(
              funcArgs.length >= 1 && funcArgs.length <= 2
            )) {
              const message = `"Strongest" only accepts an array as an argument, but here you provide ${funcArgs.length} argument${funcArgs.length > 1 ? 's' : ''}. Did you forget to wrap it in a pair of brackets?`;
              if (start && end) {
                context.report({
                  node,
                  loc: { start, end },
                  message
                });
              } else {
                context.report({ node, message });
              }
            }

            const [firstArg, secondArg] = getFuncArgs(node);
            if (firstArg && firstArg.type === 'Literal') {
              context.report({
                node: firstArg,
                message: '"HoverAction" only accepts function as its first argument. You should only use a bindable action here.'
              });
            }
            if (secondArg) {
              if (secondArg.type !== 'Literal') {
                context.report({
                  node: secondArg,
                  message: '"HoverAction" only accepts "boolean" ("true" or "false" without quotes) as its second argument.'
                });
              } else if (typeof secondArg.value !== 'boolean') {
                context.report({
                  node: secondArg,
                  message: `"HoverAction" only accepts "boolean" ("true" or "false" without quotes) as its second argument, but you provide a "${typeof secondArg.value}" here.`
                });
              }
            }
          } else if (funcName === 'Impulse') {
            checkArgsLength(context, node, 1);
            checkArgsNonLiteral(context, node);
          } else if (funcName === 'Bind') {
            const funcArgs = getFuncArgs(node);
            const { start, end } = getFuncArgLoc(node);

            if (funcArgs.length !== 2 && funcArgs.length !== 3) {
              const message = `"Bind" only accepts 2 or 3 arguments, but here you provide ${funcArgs.length} argument${funcArgs.length > 1 ? 's' : ''}.`;
              if (start && end) {
                context.report({
                  node,
                  loc: { start, end },
                  message
                });
              } else {
                context.report({ node, message });
              }
            }
          }
        }
      };
    }
  }
};
