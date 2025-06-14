module.exports = {
  extends: [
    "stylelint-config-standard", // base standard rules
    "stylelint-config-recommended-scss" // recommended SCSS rules
  ],
  plugins: [
    "stylelint-scss"
  ],
  rules: {
    // Disable rules that conflict with Prettier formatting
    "max-empty-lines": null,
    "string-quotes": null,
    "color-hex-length": null,

    // Your custom rules here, e.g.
    "indentation": 2,
    "number-leading-zero": "always",
    "block-no-empty": true,
    "unit-whitelist": ["em", "rem", "%", "s", "px", "vh", "vw"],

    // SCSS specific rules examples
    "scss/dollar-variable-pattern": "^foo",
    "scss/percent-placeholder-pattern": "^foo",
  },
  ignoreFiles: ["**/node_modules/**", "**/dist/**"],

  // Optional: allow SCSS syntax parsing
  customSyntax: "postcss-scss"
};
