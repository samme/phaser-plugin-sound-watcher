import 'mocha/mocha.js'
import { assert } from 'chai'
import Phaser from 'phaser'

import './dist/sound-watcher-plugin.umd.js'

const { mocha, Mocha } = window

mocha.setup('bdd')

const { describe: context, test, before, after, beforeEach, afterEach } = Mocha

context('Phaser', () => {
  test('is an object', () => {
    assert.isObject(Phaser)
  })

  test('is the required version', () => {
    assert.propertyVal(Phaser, 'VERSION', '3.87')
  })
})

context('SoundWatcherPlugin', () => {
  test('is a function', () => {
    // biome-ignore lint/correctness/noUndeclaredVariables: global
    assert.isFunction(SoundWatcherPlugin)
  })

  test('extends Phaser.Plugins.BasePlugin', () => {
    assert.strictEqual(
      // biome-ignore lint/correctness/noUndeclaredVariables: global
      Object.getPrototypeOf(SoundWatcherPlugin.prototype),
      Phaser.Plugins.BasePlugin.prototype
    )
  })

  test('has prototype.init() function', () => {
    // biome-ignore lint/correctness/noUndeclaredVariables: global
    assert.isFunction(SoundWatcherPlugin.prototype.init)
  })
})

mocha.checkLeaks()
mocha.globals(['Phaser', 'SoundWatcherPlugin'])
mocha.run()
