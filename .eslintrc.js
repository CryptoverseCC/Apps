module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'no-shadow': 0,
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'arrow-parens': ['error', 'always'],
    'no-unused-vars': ['error', {
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
    }],
    'react/jsx-no-bind': 0,
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/sort-comp': [2, {
      order: [
        'static-methods',
        'lifecycle',
        'render',
        'everything-else',
      ],
    }],
  },
};
