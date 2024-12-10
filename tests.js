import 'mocha/mocha.js'
import { assert } from 'chai'
import Phaser from 'phaser'
import SoundWatcherPlugin from './src/main'

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
    assert.isFunction(SoundWatcherPlugin)
  })
})

for (const config of [
  { type: Phaser.CANVAS },
  { type: Phaser.WEBGL },
  { type: Phaser.CANVAS, audio: { disableWebAudio: true } },
  { type: Phaser.WEBGL, audio: { disableWebAudio: true } },
  { type: Phaser.CANVAS, audio: { noAudio: true } },
  { type: Phaser.WEBGL, audio: { noAudio: true } }
]) {
  context(`Add the plugin to the game (${JSON.stringify(config)})`, () => {
    let game

    beforeEach(() => {
      console.group('Test')
    })

    afterEach((done) => {
      console.debug('Remove global plugin')

      game.plugins.removeGlobalPlugin('SoundWatcherPlugin')
      assert.isUndefined(
        game.plugins.getEntry('SoundWatcherPlugin'),
        'After removeGlobalPlugin("SoundWatcherPlugin"), getEntry("SoundWatcherPlugin") is undefined'
      )

      console.debug('Destroy game')

      game.events.once('destroy', done)
      game.destroy(true)
      game = null

      console.groupEnd('Test')
    })

    test('With `start: false`, `plugins.get("SoundWatcherPlugin")` starts the plugin', (done) => {
      game = new Phaser.Game({
        ...config,
        plugins: {
          global: [
            {
              key: 'SoundWatcherPlugin',
              plugin: SoundWatcherPlugin,
              start: false
            }
          ]
        },
        callbacks: {
          postBoot: (_game) => {
            const plugin = _game.plugins.get('SoundWatcherPlugin')

            assert.instanceOf(
              plugin,
              SoundWatcherPlugin,
              "get('SoundWatcherPlugin') is an instance of SoundWatcherPlugin"
            )
            assert.isTrue(
              _game.plugins.isActive('SoundWatcherPlugin'),
              'Plugin is active'
            )

            done()
          }
        }
      })
    })

    test('With `start: false`, `plugins.start("SoundWatcherPlugin")` starts the plugin', (done) => {
      game = new Phaser.Game({
        ...config,
        plugins: {
          global: [
            {
              key: 'SoundWatcherPlugin',
              plugin: SoundWatcherPlugin,
              start: false
            }
          ]
        },
        callbacks: {
          postBoot: (_game) => {
            const plugin = _game.plugins.start('SoundWatcherPlugin')

            assert.instanceOf(
              plugin,
              SoundWatcherPlugin,
              'start("SoundWatcherPlugin") is an instance of SoundWatcherPlugin'
            )
            assert.isTrue(
              _game.plugins.isActive('SoundWatcherPlugin'),
              'Plugin is active'
            )

            done()
          }
        }
      })
    })

    test('With `start: true`, the plugin is active', (done) => {
      game = new Phaser.Game({
        ...config,
        plugins: {
          global: [
            {
              key: 'SoundWatcherPlugin',
              plugin: SoundWatcherPlugin,
              start: true
            }
          ]
        },
        callbacks: {
          postBoot: (_game) => {
            const entry = _game.plugins.getEntry('SoundWatcherPlugin')

            assert.isObject(
              entry,
              'getEntry("SoundWatcherPlugin") is an object'
            )
            assert.instanceOf(
              entry.plugin,
              SoundWatcherPlugin,
              'getEntry("SoundWatcherPlugin").plugin is an instance of SoundWatcherPlugin'
            )
            assert.isTrue(
              _game.plugins.isActive('SoundWatcherPlugin'),
              'The plugin is active'
            )

            done()
          }
        }
      })
    })

    test('When active, the plugin renders', (done) => {
      game = new Phaser.Game({
        ...config,
        plugins: {
          global: [
            {
              key: 'SoundWatcherPlugin',
              plugin: SoundWatcherPlugin,
              start: true
            }
          ]
        },
        callbacks: {
          postBoot: (_game) => {
            console.log(
              'game.scale',
              _game.scale.width,
              _game.scale.height,
              JSON.stringify(_game.scale.canvasBounds)
            )

            _game.events.once('postrender', () => {
              const plugin = _game.plugins.get('SoundWatcherPlugin')

              assert.isString(plugin.text.text)
              assert.isNotEmpty(plugin.text.text)

              console.log('plugin.text.text', plugin.text.text)

              done()
            })
          }
        }
      })
    })

    test("After stop('SoundWatcherPlugin'), the plugin stops", (done) => {
      game = new Phaser.Game({
        ...config,
        plugins: {
          global: [
            {
              key: 'SoundWatcherPlugin',
              plugin: SoundWatcherPlugin,
              start: true
            }
          ]
        },
        callbacks: {
          postBoot: (_game) => {
            _game.plugins.stop('SoundWatcherPlugin')
            assert.isFalse(
              _game.plugins.isActive('SoundWatcherPlugin'),
              'Plugin is inactive after stopping'
            )

            done()
          }
        }
      })
    })

    test('With `mapping: "soundWatcher"`, the plugin is on a scene', (done) => {
      game = new Phaser.Game({
        ...config,
        plugins: {
          global: [
            {
              key: 'SoundWatcherPlugin',
              plugin: SoundWatcherPlugin,
              mapping: 'soundWatcher'
            }
          ]
        },
        scene: {
          init: function () {
            assert.propertyVal(
              this,
              'soundWatcher',
              this.plugins.get('SoundWatcherPlugin'),
              'Scene property `soundWatcher` is the plugin instance'
            )

            done()
          }
        }
      })
    })
  })
}

mocha.checkLeaks()
mocha.globals(['Phaser'])
mocha.run()
