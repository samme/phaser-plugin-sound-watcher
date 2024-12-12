Phaser Sound Watcher Plugin
===========================

Shows sounds in the Sound Manager.

Symbols
-------

| Symbol       | Description               |
|--------------|---------------------------|
| `#`          | locked                    |
| `▁▂▃▄▅▆▇█`   | volume                    |
| `m`          | mute                      |
| `>`          | playing                   |
| `:`          | paused                    |
| `.`          | not playing or paused     |
| `<<+>>`      | pan                       |
| `key:marker` | key, marker name          |
| `[0.0 / 1.0]`| seek, duration            |
| `@(x, y)`    | position                  |
| `a`          | has audio tag             |
| `-`          | has no audio tag          |

Module
------

```js
import SoundWatcherPlugin from 'phaser-plugin-sound-watcher'

new Phaser.Game({
  plugins: {
    global: [
      {
        key: 'SoundWatcherPlugin',
        plugin: SoundWatcherPlugin,
        start: true
      }
    ]
  }
})
```

UMD
---

```html
<!-- after phaser.js -->
<script src="https://cdn.jsdelivr.net/npm/phaser-plugin-sound-watcher@1.0.1"></script>
```

```js
/* global Phaser, SoundWatcherPlugin */

new Phaser.Game({
  plugins: {
    global: [
      {
        key: 'SoundWatcherPlugin',
        plugin: SoundWatcherPlugin,
        start: true
      }
    ]
  }
})
```

- [UMD example](https://codepen.io/samme/pen/WbexawE)

Quick load
----------

```js
this.load.plugin('SoundWatcherPlugin', 'https://cdn.jsdelivr.net/npm/phaser-plugin-sound-watcher@1.0.1')
```

- [Quick load example](https://phaser.io/sandbox/PgZyGawy)

Load from console
-----------------

Given a global `game` variable:

```js
game.scene.systemScene.load.plugin('SoundWatcherPlugin', 'https://cdn.jsdelivr.net/npm/phaser-plugin-sound-watcher@1.0.1').start()
```