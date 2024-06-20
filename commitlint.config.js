module.exports = {
  extends: ['jira'],
  plugins: ['commitlint-plugin-jira-rules'],
  rules: {
    'jira-task-id-project-key': [2, 'always', ['MOB']],
    'jira-task-id-separator': [2, 'always', '-'],
  },
};
