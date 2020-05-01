module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': 'npm lint',
    'pre-push': 'npm lint && npx branch-name-lint .branchlintrc'
  }
};
