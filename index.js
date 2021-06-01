const { existsSync, lstatSync } = require('fs')
const { join, dirname } = require('path')

const supportedExtensions = ['.jsx', '.js', '.mjs', '.cjs']

const fixedExtension = process.env.ESM_PKG_UTILS_EXTENSION ? `.${process.env.ESM_PKG_UTILS_EXTENSION}` : undefined

module.exports = function transform(file, api) {
  const root = api.jscodeshift(file.source)
  let changed = false

  for (const type of [
    api.jscodeshift.ImportDeclaration,
    api.jscodeshift.ExportAllDeclaration,
    api.jscodeshift.ExportNamedDeclaration
  ]) {
    root
      .find(type)
      .filter(declaration => declaration.value.source && declaration.value.source.type === 'Literal')
      .forEach(declaration => {
        let path = declaration.value.source.value

        if (!path.startsWith('.')) {
          // Not a bare import, skip it
          return
        }

        // If it is a directory import, append index.js
        let absolutePath = join(dirname(file.path), path)

        if (existsSync(absolutePath) && lstatSync(absolutePath).isDirectory()) {
          changed = true
          path = declaration.value.source.value += '/index'
          absolutePath += '/index'
        }

        // If the import path already exists, there's no need to do anything
        if (existsSync(absolutePath)) {
          return
        }

        // Autodetect the extension if needed
        let extension = fixedExtension

        if (!extension) {
          for (const ext of supportedExtensions) {
            if (existsSync(absolutePath + ext)) {
              extension = ext
            }
          }
        }

        // Perform the replacement
        if (!declaration.value.source.value.endsWith(extension)) {
          declaration.value.source.value += extension
          changed = true
        }
      })
  }

  return changed ? root.toSource() : null
}
