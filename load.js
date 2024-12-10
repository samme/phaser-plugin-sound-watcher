import 'mocha/mocha.js'
import { assert } from 'chai'
import Phaser from 'phaser'

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

context('load.plugin("SoundWatcherPlugin")', () => {
  let game

  beforeEach((done) => {
    game = new Phaser.Game({
      callbacks: {
        postBoot: () => {
          done()
        }
      }
    })
  })

  afterEach((done) => {
    // biome-ignore lint/performance/noDelete: deglobalize
    delete window.SoundWatcherPlugin

    game.events.once('destroy', () => {
      game = null
      done()
    })
    game.destroy(true)
  })

  test('load.plugin("SoundWatcherPlugin", url, true) adds and starts the plugin', (done) => {
    const scene = game.scene.systemScene

    scene.load
      .plugin('SoundWatcherPlugin', 'dist/sound-watcher-plugin.umd.js', true)
      .start()

    scene.load.once('complete', () => {
      assert.strictEqual(
        scene.plugins.getClass('SoundWatcherPlugin'),
        window.SoundWatcherPlugin,
        'plugins.getClass("SoundWatcherPlugin") is SoundWatcherPlugin'
      )

      assert.isObject(
        scene.plugins.getEntry('SoundWatcherPlugin'),
        'plugins.getEntry("SoundWatcherPlugin") is an object'
      )

      assert.isTrue(
        scene.plugins.isActive('SoundWatcherPlugin'),
        'plugins.isActive("SoundWatcherPlugin") is true'
      )

      done()
    })
  })
})

mocha.globals(['Phaser', 'SoundWatcherPlugin'])
mocha.checkLeaks()
mocha.run()
