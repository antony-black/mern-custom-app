module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier', // disables rules that conflict with Prettier
  ],
  plugins: ['stylelint-scss'],
  rules: {
    'at-rule-no-unknown': null, // required for SCSS compatibility
    'scss/at-rule-no-unknown': true,

    'no-descending-specificity': null, // optional: disable specificity rule that can get noisy
    'selector-class-pattern': null, // optional: relax class naming restrictions for CSS modules

    'prettier/prettier': true,
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'declaration-block-trailing-semicolon': 'always',
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
  },
  ignoreFiles: ['**/*.js', '**/*.ts', '**/*.tsx'],
};
