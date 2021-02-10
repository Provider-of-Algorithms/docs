const matter = require('gray-matter')
const revalidator = require('revalidator')
const { difference, intersection } = require('lodash')
const fs = require('fs')
const fm = require('./frontmatter')

function readFrontmatter (markdown, opts = { validateKeyNames: false, validateKeyOrder: false }) {
  const schema = opts.schema || { properties: {} }
  const filepath = opts.filepath || null
const endLine = '\n---\n'

  let content, data
  let errors = []

  try {
    ({ content, data } = matter(markdown))
  } catch (e) {
    const defaultReason = 'invalid frontmatter entry'

    const reason = e.reason
      // make this common error message a little easier to understand
      ? e.reason.startsWith('can not read a block mapping entry;') ? defaultReason : e.reason
      : defaultReason

    const error = {
      reason,
      message: 'YML parsing error!'
/**
 * Reads the given filepath, but only up until `endLine`, using streams to
 * read each chunk and close the stream early.
 */
async function readFrontmatter (filepath) {
  const readStream = fs.createReadStream(filepath, { encoding: 'utf8', emitClose: true })
  return new Promise((resolve, reject) => {
    let frontmatter = ''
    readStream
      .on('data', function (chunk) {
        const endOfFrontmatterIndex = chunk.indexOf(endLine)
        if (endOfFrontmatterIndex !== -1) {
          frontmatter += chunk.slice(0, endOfFrontmatterIndex + endLine.length)
          // Stop early!
          readStream.destroy()
        } else {
          frontmatter += chunk
    }

    if (filepath) error.filepath = filepath
    errors.push(error)
    return { errors }
      })
      .on('error', (error) => reject(error))
      // Stream has been destroyed and file has been closed
      .on('close', () => resolve(frontmatter))
  })
  }

  const allowedKeys = Object.keys(schema.properties)
  const existingKeys = Object.keys(data)
  const expectedKeys = intersection(allowedKeys, existingKeys)

  ;({ errors } = revalidator.validate(data, schema))

  // add filepath property to each error object
  if (errors.length && filepath) {
    errors = errors.map(error => Object.assign(error, { filepath }))
  }

  // validate key names
  if (opts.validateKeyNames) {
    const invalidKeys = difference(existingKeys, allowedKeys)
    invalidKeys.forEach(key => {
      const error = {
        property: key,
        message: `not allowed. Allowed properties are: ${allowedKeys.join(', ')}`
      }
      if (filepath) error.filepath = filepath
      errors.push(error)
    })
  }
/**
 * Read only the frontmatter from a file
 */
module.exports = async function fmfromf (filepath, languageCode) {
  let fileContent = filepath.endsWith('index.md')
    // For index files, we need to read the whole file because they contain ToC info
    ? await fs.promises.readFile(filepath, 'utf8')
    // For everything else, only read the frontmatter
    : await readFrontmatter(filepath)

  // validate key order
  if (opts.validateKeyOrder && existingKeys.join('') !== expectedKeys.join('')) {
    const error = {
      property: 'keys',
      message: `keys must be in order. Current: ${existingKeys.join(',')}; Expected: ${expectedKeys.join(',')}`
    }
    if (filepath) error.filepath = filepath
    errors.push(error)
  // TODO remove this when crowdin-support issue 66 has been resolved
  if (languageCode !== 'en' && fileContent.includes(': verdadero')) {
    fileContent = fileContent.replace(': verdadero', ': true')
  }

  return { content, data, errors }
  return fm(fileContent, { filepath })
}

// Expose gray-matter's underlying stringify method for joining a parsed
// frontmatter object and a markdown string back into a unified string
//
// stringify('some string', {some: 'frontmatter'})
readFrontmatter.stringify = matter.stringify

module.exports = readFrontmatter
