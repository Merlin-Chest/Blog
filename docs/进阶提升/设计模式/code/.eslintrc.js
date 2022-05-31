// .eslintrc.js
module.exports = {
  // ...
  overrides: [
    {
      files: ['*.html'],
      rules: {
        'vue/comment-directive': 'off',
      },
    },
  ],
};
