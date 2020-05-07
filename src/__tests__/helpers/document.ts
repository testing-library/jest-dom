import * as extensions from '../../matchers'

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

type Extensions = typeof extensions

declare global {
  namespace jest {
    interface Matchers<R, T> extends Extensions {}
  }
}
