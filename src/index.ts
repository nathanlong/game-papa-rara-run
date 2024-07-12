import "./style.css";

import Phaser from "phaser";
import GameStart from "./scenes/gamestart";
import Game from "./scenes/game";
import GameOver from "./scenes/gameover";

// game configuration object
const config: Phaser.Types.Core.GameConfig = {
  width: 900,
  height: 300,
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  scene: [GameStart, Game, GameOver],
  parent: "app",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: {
        y: 1000,
        x: 0,
      },
    },
  },
};

// the game itself
new Phaser.Game(config);
