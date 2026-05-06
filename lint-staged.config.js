module.exports = {
  'README.md': ['doctoc --maxlevel 3 --notitle'],
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|gql|graphql|mdx|vue)': [
    'prettier --write',
  ],
  '*.+(js|jsx|ts|tsx)': [
    'eslint --cache --cache-location ./node_modules/.cache/eslint --fix',
  ],
}
