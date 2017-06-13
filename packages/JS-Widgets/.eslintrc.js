module.exports = {
  extends: ["semistandard", "standard-preact"],
  env: {
    browser: true,
    node: true,
  },
  globals: {
    web3: false,
  },
  rules: {
    'space-before-function-paren': ['error', { anonymous: 'always', named: 'never' }],
    'jsx-quotes': ['error', 'prefer-double'],
    'react/no-unknown-property': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'react/prop-types': 'off',
    'padded-blocks': 'off',
  },
};
