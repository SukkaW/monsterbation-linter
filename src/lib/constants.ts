import type { Linter } from 'eslint';

import { browser, greasemonkey } from 'globals';
import { monsterbationESLintRule } from './eslint-monsterbation';

const MONSTERBATION_GLOBALS = [
  // Global Variables
  'timelog',
  'combatlog',
  'vitals',
  'droplog',
  'damage',
  'regexp',
  // Bindable Function
  'Toggle',
  'Cast',
  'Use',
  'Nothing',
  'NextRound',
  'TargetMonster',
  'Strongest',
  'HoverAction',
  'Impulse',
  'ToggleHover',
  'Drops',
  'CursorUp',
  'CursorDown',
  'CursorTarget',
  'CursorHover',
  'ClearTarget',
  'Settings',
  'Bind',
  'Keybind',
  'NoMod',
  'CtrlAltShift',
  'CtrlShift',
  'AltShift',
  'CtrlAlt',
  'Ctrl',
  'Shift',
  'Alt',
  'Any',
  // Helper Function
  'handleKeys',
  'handleKeyup',
  // Key Code
  ...[
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split(''),
    'SPACE',
    'ENTER',
    'PAGEUP',
    'PAGEDOWN',
    'END',
    'HOME',
    'LEFT',
    'UP',
    'RIGHT',
    'DOWN',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'COMMA',
    'PERIOD',
    'SLASH',
    'FORWARDSLASH',
    'GRAVE',
    'TILDE',
    'LBRACKET',
    'BACKSLASH',
    'SEMI',
    'RBRACKET',
    'APOSTROPHE',
    'SHIFT',
    'CTRL',
    'ALT'
  ].map(letter => `KEY_${letter}`)
];

export const ESLINT_OPTIONS: Linter.Config[] = [{
  languageOptions: {
    ecmaVersion: 'latest' as const,
    sourceType: 'script' as const,
    parserOptions: {
      ecmaVersion: 'latest' as const,
      sourceType: 'script' as const,
      ecmaFeatures: {}
    },
    globals: {
      ...browser,
      ...greasemonkey,
      ...MONSTERBATION_GLOBALS.reduce<Record<string, 'readonly'>>((acc, key) => {
        acc[key] = 'readonly';
        return acc;
      }, {})
    }
  },
  plugins: {
    monsterbation: {
      rules: {
        monsterbation: monsterbationESLintRule
      }
    }
  },
  rules: {
    'no-case-declarations': 2,
    'no-class-assign': 2,
    'no-compare-neg-zero': 2,
    'no-cond-assign': 2,
    'no-const-assign': 2,
    'no-constant-condition': 2,
    'no-control-regex': 2,
    'no-debugger': 2,
    'no-dupe-args': 2,
    'no-dupe-else-if': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-ex-assign': 2,
    'no-extra-boolean-cast': 2,
    'no-fallthrough': 2,
    'no-inner-declarations': 2,
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-loss-of-precision': 2,
    'no-misleading-character-class': 2,
    'no-new-symbol': 2,
    'no-nonoctal-decimal-escape': 2,
    'no-obj-calls': 2,
    'no-octal': 2,
    'no-prototype-builtins': 2,
    'no-redeclare': 2,
    'no-regex-spaces': 2,
    'no-self-assign': 2,
    'no-setter-return': 2,
    'no-shadow-restricted-names': 2,
    'no-sparse-arrays': 2,
    'no-this-before-super': 2,
    'no-undef': 2,
    'no-unexpected-multiline': 2,
    'no-unreachable': 2,
    'no-unsafe-finally': 2,
    'no-unsafe-negation': 2,
    'no-unsafe-optional-chaining': 2,
    'no-useless-backreference': 2,
    'no-useless-catch': 2,
    'no-useless-escape': 2,
    'require-yield': 2,
    'valid-typeof': 2,
    'no-confusing-arrow': 2,
    'no-caller': 2,
    'no-await-in-loop': 2,
    'no-array-constructor': 2,
    'no-constructor-return': 2,
    'no-dupe-class-members': 2,
    'no-div-regex': 2,
    'no-delete-var': 2,
    'monsterbation/monsterbation': 2
  } as const
}];

export const COMMON_ERROR_MESSAGES = {
  parsingError: 'Did you forget to put the quotation marks in pairs?\nOr did you miss a semicolon / comma?\nOr did you add an extra space?',
  'no-undef': 'Did you forget to wrap it in quotes?\nOr did you spell your binding name wrong?'
} as Record<string, string> & { parsingError: string };
