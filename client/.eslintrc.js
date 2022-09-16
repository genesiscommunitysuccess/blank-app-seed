module.exports = {
  'parser': '@typescript-eslint/parser',
  'plugins': [
    '@typescript-eslint',
  ],
  'parserOptions': {
    'project': './tsconfig.eslint.json',
    'ecmaVersion': 2020,
    'sourceType': 'module',
  },
  'extends': [
    'google',
  ],
  'ignorePatterns': [
    '**/dist/**',
  ],
  'rules': {
    'jsx-quotes': ['error', 'prefer-double'],
    'valid-jsdoc': 'off',
    'require-jsdoc': 'off',
    // `h` in particular is "unused" but used in the built rendering
    'no-unused-vars': 'off',
    // Stencil's output throws this off given the multiple contexts
    'no-invalid-this': 'off',
    // Decorators in TypeScript throw this off
    'new-cap': 'off',
    // Custom max length from Google's recommendation
    'max-len': ['error', {
      'code': 120,
      'tabWidth': 4,
      'ignoreComments': true,
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreRegExpLiterals': true,
    }],
    'eol-last': ['error', 'always'],
    'require-await': ['off'],
    'require-yield': ['error'],
    'no-async-promise-executor': ['error'],
    'no-await-in-loop': ['error'],
    'require-atomic-updates': ['error'],
    'complexity': ['error', {'max': 20}],
    'max-depth': ['error', {'max': 4}],
    'prefer-promise-reject-errors': ['error'],
    'no-throw-literal': ['error'],
    'no-promise-executor-return': ['error'],
    'no-sparse-arrays': ['error'],
    'no-unreachable-loop': ['error'],
    'no-unsafe-optional-chaining': ['error'],
    'no-lone-blocks': ['error'],
    '@typescript-eslint/no-magic-numbers': ['warn', {
      'detectObjects': false,
      'ignoreDefaultValues': true,
      'ignoreArrayIndexes': true,
      'ignoreEnums': true,
      'ignoreNumericLiteralTypes': true,
      'ignoreReadonlyClassProperties': true,
      'ignore': [
        -1,
        0,
        1,
        2,
        100,
      ],
    }],
    'no-unmodified-loop-condition': ['error'],
    'no-useless-call': ['error'],
    'prefer-named-capture-group': ['off'],
    'no-shadow': ['off'],
    '@typescript-eslint/no-shadow': ['error'],
    'no-shadow-restricted-names': ['error'],
    'no-use-before-define': ['error'],
    'no-plusplus': ['error'],
    'guard-for-in': ['error'],
    'no-return-await': ['error'],
    'indent': ['error', 2, {SwitchCase: 1}],
    'arrow-parens': ['error', 'as-needed', {'requireForBlockBody': true}],
    'padded-blocks': 'off',
  },
  'overrides': [
    {
      'files': ['*.styles.ts', 'webpack.config.js'],
      'rules': {
        '@typescript-eslint/no-magic-numbers': ['off'],
      },
    },
  ],
};
