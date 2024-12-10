import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import packageJson from './package.json'

const validatePath = (relativePath) => {
  const absolutePath = path.resolve(__dirname, relativePath)
  return fs.existsSync(absolutePath)
}

describe('package.json paths', () => {
  test('main field should have a valid path', () => {
    const mainPath = packageJson.main
    expect(validatePath(mainPath)).toBe(true)
  })

  test('module field should have a valid path', () => {
    const modulePath = packageJson.module
    expect(validatePath(modulePath)).toBe(true)
  })

  test('files field should have valid paths', () => {
    const files = packageJson.files
    for (const file of files) {
      expect(validatePath(file)).toBe(true)
    }
  })
})
