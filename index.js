const { existsSync, lstatSync } = require('fs')
const { join, dirname } = require('path')

const extension = `.${process.env.ESM_PKG_UTILS || 'js'}`

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
        const absolutePath = join(dirname(file.path), path)

        if (existsSync(absolutePath) && lstatSync(absolutePath).isDirectory()) {
          path = declaration.value.source.value += '/index'
        }

        if (!declaration.value.source.value.endsWith(extension)) {
          declaration.value.source.value += extension
          changed = true
        }
      })
  }

  return changed ? root.toSource() : null
}
