if (global.document) {
  module.exports = global.document
} else {
  const {JSDOM} = require('jsdom')
  const {window} = new JSDOM()

  module.exports = window.document
}
