module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'references-empty': [2, 'never'],
    'subject-case': [
      2,
      'always',
      [
        'lower-case',
        'upper-case',
        'camel-case',
        'pascal-case',
        'sentence-case',
        'snake-case',
        'start-case'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      ['config', 'core', 'infrastructure', 'modules', 'project']
    ]
  },
  parserPreset: {
    parserOpts: {
      referenceActions: null,
      issuePrefixes: ['PENG-', 'BOPS2-', 'SELL-', 'GUIDE-', 'PERS']
    }
  }
};
