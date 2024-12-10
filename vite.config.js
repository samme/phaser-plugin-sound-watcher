import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'SoundWatcherPlugin',
      fileName: (format) => `sound-watcher-plugin.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['phaser'],
      output: {
        globals: {
          phaser: 'Phaser'
        },
        dir: 'dist'
      }
    },
    minify: false
  },
  esbuild: {
    drop: ['console'],
    legalComments: 'eof'
  }
})
