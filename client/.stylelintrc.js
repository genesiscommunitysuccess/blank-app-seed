module.exports = {
  "customSyntax": "postcss-syntax",
  'extends': [
    'stylelint-config-standard',
  ],
  'includes': [
    '*.styles.ts',
  ],
  'rules': {
    'function-name-case': [
      'lower',
      { 
        'ignoreFunctions': ['/^primary.*$/', '/^secondary.*$/', '/^neutral.*$/', '/^foreground.*$/', '/^white.*$/', '/^chart.*$/']
      }
    ],
    'max-line-length': null,
    'no-empty-first-line': null,
    'value-keyword-case': [
      'lower', 
      { 
        'ignoreKeywords': ['/^Color.*$/', '/^Primary.*$/', '/^Secondary.*$/', '/^Neutral.*$/', '/^active.*$/', '/^stock.*$/']
      },
    ]
  }
};
