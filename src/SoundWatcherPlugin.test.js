import EventEmitter from 'eventemitter3'
import Phaser from 'phaser'
import { beforeEach, expect, test, vi } from 'vitest'
import { SoundWatcherPlugin } from './SoundWatcherPlugin.js'

import NoAudioSound from 'phaser/src/sound/noaudio/NoAudioSound.js'

vi.mock('phaser', () => {
  const BasePlugin = vi.fn(function (pluginManager) {
    const game = {
      events: new EventEmitter(),
      renderer: { type: 1 },
      scene: {
        systemScene: {
          sys: {
            cameras: { default: {} },
            make: {
              text: vi.fn(() => {
                return {
                  text: '',
                  destroy: vi.fn(),
                  getTextMetrics: vi.fn(),
                  renderCanvas: vi.fn(),
                  renderWebGL: vi.fn(),
                  setOrigin: vi.fn(),
                  setText: vi.fn(function (value) {
                    this.text = value.join('\n')
                    return this
                  })
                }
              })
            }
          }
        }
      },
      sound: {
        mute: false,
        sounds: [],
        volume: 1
      }
    }

    game.sound.sounds.push(
      new NoAudioSound(game.sound, 'sound1'),
      new NoAudioSound(game.sound, 'sound2'),
      new NoAudioSound(game.sound, 'sound3')
    )

    this.pluginManager = { game }

    this.game = game
  })

  BasePlugin.prototype.init = vi.fn()
  BasePlugin.prototype.start = vi.fn()
  BasePlugin.prototype.stop = vi.fn()
  BasePlugin.prototype.destroy = vi.fn()

  return {
    default: {
      CANVAS: 1,
      WEBGL: 2,
      Plugins: {
        BasePlugin: BasePlugin
      },
      Core: {
        Events: {
          BLUR: 'blur',
          BOOT: 'boot',
          CONTEXT_LOST: 'contextlost',
          CONTEXT_RESTORED: 'contextrestored',
          DESTROY: 'destroy',
          FOCUS: 'focus',
          HIDDEN: 'hidden',
          PAUSE: 'pause',
          POST_RENDER: 'postrender',
          POST_STEP: 'poststep',
          PRE_RENDER: 'prerender',
          PRE_STEP: 'prestep',
          READY: 'ready',
          RESUME: 'resume',
          STEP: 'step',
          VISIBLE: 'visible'
        }
      },
      Math: {
        Clamp: vi.fn((val, min, max) => Math.min(max, Math.max(min, val)))
      }
    }
  }
})

test('SoundWatcherPlugin a function', () => {
  expect(SoundWatcherPlugin).toBeInstanceOf(Function)
})

test('SoundWatcherPlugin.prototype is an object', () => {
  expect(SoundWatcherPlugin.prototype).toBeInstanceOf(Object)
})

test('SoundWatcherPlugin.prototype.render() is a function', () => {
  expect(SoundWatcherPlugin.prototype.render).toBeInstanceOf(Function)
})

test('new SoundWatcherPlugin() is an object', () => {
  const plugin = new SoundWatcherPlugin()

  expect(plugin).toBeInstanceOf(Object)
})

test('new SoundWatcherPlugin() has `pluginManager` and `game.events`', () => {
  const plugin = new SoundWatcherPlugin()

  expect(plugin.pluginManager).toBeDefined()
  expect(plugin.game.events).toBeInstanceOf(EventEmitter)
})

test('add and remove', () => {
  const plugin = new SoundWatcherPlugin()

  plugin.init()
  plugin.destroy()

  expect(plugin.game).toBe(null)
  expect(plugin.pluginManager).toBe(null)
})

test('add, start, stop, remove', () => {
  const plugin = new SoundWatcherPlugin()

  plugin.init()
  plugin.start()
  plugin.stop()
  plugin.start()
  plugin.stop()
  plugin.destroy()
})

test('add, start, render, stop, remove', () => {
  const plugin = new SoundWatcherPlugin()

  plugin.init()
  plugin.start()
  plugin.render()
  plugin.stop()
  plugin.destroy()
})

test('game events POST_RENDER', () => {
  const plugin = new SoundWatcherPlugin()
  const { POST_RENDER } = Phaser.Core.Events
  const renderSpy = vi.spyOn(plugin, 'render')

  expect(plugin.game.events.listenerCount(POST_RENDER)).toBe(0)

  plugin.init()
  plugin.start()

  expect(plugin.game.events.listenerCount(POST_RENDER)).toBe(1)

  expect(renderSpy).not.toHaveBeenCalled()

  plugin.game.events.emit(POST_RENDER)

  expect(renderSpy).toHaveBeenCalledOnce()

  plugin.stop()
  plugin.destroy()
})

test('game events READY, PRE_STEP, STEP, POST_STEP, PRE_RENDER, POST_RENDER, DESTROY', () => {
  const plugin = new SoundWatcherPlugin()
  const { READY, PRE_STEP, STEP, POST_STEP, PRE_RENDER, POST_RENDER, DESTROY } =
    Phaser.Core.Events
  const { events } = plugin.game
  const renderSpy = vi.spyOn(plugin, 'render')
  const destroySpy = vi.spyOn(plugin, 'destroy')

  plugin.init()
  plugin.start()

  expect(events.listenerCount(Phaser.Core.Events.POST_RENDER)).toBe(1)

  events.emit(READY)

  events.emit(PRE_STEP)
  events.emit(STEP)
  events.emit(POST_STEP)
  events.emit(PRE_RENDER)
  events.emit(POST_RENDER)

  expect(renderSpy).toHaveBeenCalledOnce()

  events.emit(PRE_STEP)
  events.emit(STEP)
  events.emit(POST_STEP)
  events.emit(PRE_RENDER)
  events.emit(POST_RENDER)

  expect(renderSpy).toHaveBeenCalledTimes(2)

  events.emit(DESTROY)

  expect(destroySpy).toHaveBeenCalledOnce()
  expect(plugin.game).toBe(null)
  expect(plugin.pluginManager).toBe(null)
})
