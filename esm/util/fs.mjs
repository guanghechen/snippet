import path from 'node:path'
import fs from 'node:fs'

/**
 * Create directories on the given path.
 *
 * @param {string} filepath
 * @param {boolean} isDir
 * @param {import('../types/reporter.mjs').IReporter} [reporter]
 */
export function mkdirsIfNotExists(filepath, isDir, reporter) {
  const dirpath = isDir ? filepath : path.dirname(filepath)
  if (fs.existsSync(dirpath)) return

  reporter?.verbose?.('mkdirs: {}', dirpath)

  fs.mkdirSync(dirpath, { recursive: true })
}

/**
 * Write json to the given filepath.
 * @param {string} filepath - The file path where to store the json content.
 * @param {unknown} json - The json object to save.
 * @param {prettier} [prettier] - Whether if insert spaces to make the json looks prettier.
 */
export function writeJsonToFile(filepath, json, prettier = true) {
  const content = prettier ? JSON.stringify(json, null, 2) + '\n' : JSON.stringify(json) + '\n'
  fs.writeFileSync(filepath, content, 'utf8')
}
