(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("phaser")) : typeof define === "function" && define.amd ? define(["phaser"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.SoundWatcherPlugin = factory(global.Phaser));
})(this, function(Phaser) {
  "use strict";
  const { DESTROY, POST_RENDER, SYSTEM_READY } = Phaser.Core.Events;
  const { Clamp } = Phaser.Math;
  const volumeIcons = " ▁▂▃▄▅▆▇█".split("");
  const panIcons = "<<+>>";
  const getTimeline = (sound) => {
    const timeline = "-----".split("");
    const icon = getIcon(sound);
    const index = Clamp(
      Math.floor(sound.seek / sound.duration * timeline.length),
      0,
      timeline.length - 1
    );
    timeline[index] = icon;
    return timeline.join("");
  };
  const getVolumeIcon = (volume) => volumeIcons[Math.floor(volume * (volumeIcons.length - 1))];
  const getMuteIcon = (mute) => mute ? "m" : " ";
  const getIcon = (sound) => {
    if (sound.isPlaying) {
      return ">";
    }
    if (sound.isPaused) {
      return ":";
    }
    if (sound.pendingRemove) {
      return "X";
    }
    return ".";
  };
  const getPanLine = (pan) => {
    if (pan === void 0) {
      return "";
    }
    const panLine = "     ".split("");
    const index = Math.round(0.5 * (pan + 1) * (panLine.length - 1));
    panLine[index] = panIcons[index];
    return panLine.join("");
  };
  const getSoundName = (sound) => sound.currentMarker ? `"${sound.key}:${sound.currentMarker.name}"` : `"${sound.key}"`;
  const getSoundTimecode = (sound) => `[${sound.seek.toFixed(1)} / ${sound.duration.toFixed(1)}]`;
  const getVectorDescription = (vector, precision = 0, prefix = "") => {
    if (!vector) {
      return "";
    }
    return `${prefix}(${vector.x.toFixed(precision)}, ${vector.y.toFixed(precision)})`;
  };
  const getTagDescription = (sound) => {
    const { audio } = sound;
    if (audio === void 0) {
      return "";
    }
    if (audio === null) {
      return "-";
    }
    return "a";
  };
  const getLockedIcon = (mgr) => mgr.locked ? "#" : " ";
  const getSoundDescription = (sound) => {
    if (sound.pendingRemove) {
      return `${getTimeline(sound)} ${getSoundName(sound)}`;
    }
    return `${getVolumeIcon(sound.volume)} ${getMuteIcon(sound.mute)} ${getTimeline(sound)} ${getPanLine(sound.pan)} ${getSoundName(sound)} ${getSoundTimecode(sound)} ${getVectorDescription(sound.spatialSource, 0, "@")} ${getTagDescription(sound)}`;
  };
  class SoundWatcherPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
      super(pluginManager);
      this.text;
    }
    init() {
      this.game.events.once(DESTROY, this.destroy, this);
    }
    start() {
      const { systemScene } = this.game.scene;
      if (!systemScene) {
        this.game.events.once(SYSTEM_READY, this.start, this);
        return;
      }
      this.text = systemScene.sys.make.text({
        style: {
          backgroundColor: "#0009",
          fill: "white",
          font: "16px monospace",
          metrics: { ascent: 13, descent: 4, fontSize: 20 },
          fixedWidth: 512
        }
      });
      const { renderer } = this.game;
      if (!renderer) {
        throw new Error("No renderer");
      }
      if (renderer.type === Phaser.WEBGL) {
        this.renderText = this.text.renderWebGL;
      } else if (renderer.type === Phaser.CANVAS) {
        this.renderText = this.text.renderCanvas;
      } else {
        throw new Error(`Unsupported renderer type: ${renderer.type}`);
      }
      this.game.events.on(POST_RENDER, this.render, this);
    }
    stop() {
      this.text.destroy();
      this.text = null;
      this.game.events.off(POST_RENDER, this.render, this);
    }
    render() {
      const mgr = this.game.sound;
      const camera = this.game.scene.systemScene.sys.cameras.default;
      const renderer = this.game.renderer;
      const output = [];
      output.push(
        `${getVolumeIcon(mgr.volume)} ${getMuteIcon(mgr.mute)} ${getLockedIcon(mgr)} ${mgr.sounds.length} sounds ${getVectorDescription(mgr.listenerPosition, 0, "@")}`
      );
      for (const sound of mgr.sounds) {
        output.push(getSoundDescription(sound));
      }
      this.text.setText(output);
      this.renderText(renderer, this.text, camera);
      if (renderer.type === Phaser.WEBGL) {
        renderer.flush();
      }
    }
    renderText() {
    }
    destroy() {
      this.pluginManager = null;
      this.game = null;
      this.text = null;
    }
  }
  return SoundWatcherPlugin;
});
