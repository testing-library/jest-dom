const {resolveKcdScripts, resolveBin} = require('kcd-scripts/dist/utils')

const kcdScripts = resolveKcdScripts()
const doctoc = resolveBin('doctoc')

// Custom lint-staged config to work around Jest --findRelatedTests unreliability:
// https://github.com/facebook/jest/issues/11527
module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`],
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|gql|graphql|mdx|vue)': [
    `${kcdScripts} format`,
    `${kcdScripts} lint`,
    () => `${kcdScripts} test`,
  ],
}
