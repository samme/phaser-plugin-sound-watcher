import Phaser from 'phaser'
import SoundWatcherPlugin from './src/main'

class Example extends Phaser.Scene {
  preload() {
    this.load.image('touhou', 'touhou1.png')
    this.load.image('seablue', 'seablue.png')

    this.load.audio('bass', ['bass.mp3'])
    this.load.audio('drums', ['drums.mp3'])
    this.load.audio('percussion', ['percussion.mp3'])
    this.load.audio('synth1', ['synth1.mp3'])
    this.load.audio('synth2', ['synth2.mp3'])
    this.load.audio('top1', ['top1.mp3'])
    this.load.audio('top2', ['top2.mp3'])
  }

  create() {
    this.add.image(400, 300, 'seablue')
    this.add.image(790, 600, 'touhou').setOrigin(1)

    const bass = this.sound.add('bass')
    const drums = this.sound.add('drums')
    const percussion = this.sound.add('percussion')
    const synth1 = this.sound.add('synth1')
    const synth2 = this.sound.add('synth2')
    const top1 = this.sound.add('top1')
    const top2 = this.sound.add('top2')

    const keys = [
      'Press A for Bass',
      'Press B for Drums',
      'Press C for Percussion',
      'Press D for Synth1',
      'Press E for Synth2',
      'Press F for Top1',
      'Press G for Top2',
      '',
      'SPACE to stop all sounds'
    ]

    const text = this.add.text(10, 300, keys, {
      font: '32px Courier',
      fill: 'crimson'
    })

    if (this.sound.locked) {
      text.setText('Click to start')

      this.sound.once('unlocked', () => {
        text.setText(keys)
      })
    }

    this.input.keyboard.on(
      'keydown-SPACE',
      function () {
        this.sound.stopAll()
      },
      this
    )

    this.input.keyboard.on('keydown-A', () => {
      bass.play()
    })

    this.input.keyboard.on('keydown-B', () => {
      drums.play()
    })

    this.input.keyboard.on('keydown-C', () => {
      percussion.play()
    })

    this.input.keyboard.on('keydown-D', () => {
      synth1.play()
    })

    this.input.keyboard.on('keydown-E', () => {
      synth2.play()
    })

    this.input.keyboard.on('keydown-F', () => {
      top1.play()
    })

    this.input.keyboard.on('keydown-G', () => {
      top2.play()
    })
  }
}

new Phaser.Game({
  plugins: {
    global: [
      {
        key: 'SoundWatcherPlugin',
        plugin: SoundWatcherPlugin,
        start: true
      }
    ]
  },
  width: 800,
  height: 600,
  scene: Example
})
