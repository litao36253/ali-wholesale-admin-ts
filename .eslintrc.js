module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 11,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    camelcase: 'off'
  },
  globals: {
    uni: true,
    uniCloud: true
  }
}
