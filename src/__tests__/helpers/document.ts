let document: Document

const globalWithDocument = global as {
  document?: Document
}

if (globalWithDocument.document) {
  document = globalWithDocument.document
} else {
  const {JSDOM} = require('jsdom')
  const {window} = new JSDOM()
  document = window.document
}

export default document
