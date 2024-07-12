import Player from "../objects/player";
import Generator from "../objects/generator";

export default class Game extends Phaser.Scene {
  score: number;
  player: Player | null;
  scoreText: Phaser.GameObjects.BitmapText | null;
  width: string | number;
  height: string | number;
  center_width: number;
  center_height: number;
  backgroundSpeed: number;
  obstacles: Phaser.GameObjects.Group;
  coins: Phaser.GameObjects.Group;
  generator: Generator;
  SPACE: Phaser.Input.Keyboard.Key;
  updateScoreEvent: Phaser.Time.TimerEvent;
  jumpTween: Phaser.Tweens.Tween;
  audios: object;
  mountains: Phaser.GameObjects.TileSprite;
  trees: Phaser.GameObjects.TileSprite;
  trees2: Phaser.GameObjects.TileSprite;
  treeTween: Phaser.Tweens.Tween;
  treeTween2: Phaser.Tweens.Tween;
  theme: Phaser.Sound.HTML5AudioSound;

  constructor() {
    super({
      key: "Game",
    });
    this.player = null;
    this.score = 0;
    this.scoreText = null;
    this.backgroundSpeed = 1;
  }

  // preload assets
  preload(): void {
    // we can pass values to the registry to access in other scenes
    this.registry.set("score", "0");
    this.score = 0;
  }

  // initialize the game
  create(): void {
    // reset gameover vars
    this.anims.resumeAll();
    this.tweens.resumeAll();
    this.backgroundSpeed = 1;

    // continue setup
    this.width = this.registry.get("width");
    this.height = this.registry.get("height");
    this.center_width = this.registry.get("center_width");
    this.center_height = this.registry.get("center_height");

    this.cameras.main.setBackgroundColor(0x87ceeb);
    this.obstacles = this.add.group();
    this.coins = this.add.group();

    this.anims.create({
      key: "coin",
      frames: this.anims.generateFrameNumbers("coin", {
        start: 0,
        end: 8,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "rara",
      frames: this.anims.generateFrameNames("papa", {
        start: 0,
        end: 5,
      }),
      frameRate: 16,
      repeat: -1,
    });

    this.anims.create({
      key: "rara-flip",
      frames: this.anims.generateFrameNames("papa", {
        start: 6,
        end: 20,
      }),
      frameRate: 16,
      repeat: 0,
    });

    this.anims.create({
      key: "tomato",
      frames: this.anims.generateFrameNames("tomato", {
        start: 0,
        end: 4,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "rooted-sprout",
      frames: this.anims.generateFrameNames("rooted", {
        start: 0,
        end: 4,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "rooted-idle",
      frames: this.anims.generateFrameNames("rooted", {
        start: 5,
        end: 9,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.mountains = this.add
      .tileSprite(0, 0, 900, 300, "mountains")
      .setOrigin(0, 0);
    // this.trees2 = this.add
    //   .tileSprite(0, 204, 900, 96, "trees2")
    //   .setOrigin(0, 0);
    // this.trees = this.add.tileSprite(0, 236, 900, 64, "trees").setOrigin(0, 0);
    this.trees2 = this.add
      .tileSprite(0, 300, 900, 96, "trees2")
      .setOrigin(0, 0);
    this.trees = this.add.tileSprite(0, 300, 900, 64, "trees").setOrigin(0, 0);

    this.treeTween = this.tweens.add({
      targets: this.trees,
      duration: 1000,
      y: 236,
      ease: "Power1",
      repeat: 0,
    });

    this.treeTween2 = this.tweens.add({
      targets: this.trees2,
      duration: 800,
      y: 204,
      ease: "Power1",
      repeat: 0,
    });

    this.generator = new Generator(this, this.obstacles, this.coins);
    this.player = new Player(this, this.center_width - 250, this.height - 200);
    this.player.body.setCircle(16, 0, 0)

    this.SPACE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.scoreText = this.add.bitmapText(
      this.center_width - 20 * 4,
      10,
      "mario",
      this.score.toString().padStart(9, "0"),
      20,
    );

    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.hitObstacle,
      () => {
        return true;
      },
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.hitCoin,
      () => {
        return true;
      },
      this,
    );

    this.loadAudios();
    this.playMusic();

    this.input.on("pointerdown", (pointer) => this.jump(), this);

    this.updateScoreEvent = this.time.addEvent({
      delay: 100,
      callback: () => this.updateScore(),
      callbackScope: this,
      loop: true,
    });
  }

  hitObstacle(
    player: Phaser.Physics.Arcade.Sprite,
    obstacle: Phaser.Physics.Arcade.Sprite,
  ) {
    this.updateScoreEvent.destroy();
    this.finishScene();
  }

  hitCoin(
    player: Phaser.Physics.Arcade.Sprite,
    coin: Phaser.Physics.Arcade.Sprite,
  ) {
    this.playAudio("coin");
    this.updateScore(1000);
    coin.destroy();
  }

  loadAudios() {
    this.audios = {
      jump: this.sound.add("jump"),
      coin: this.sound.add("coin"),
      dead: this.sound.add("dead"),
    };
  }

  playAudio(key: string) {
    this.audios[key].play();
  }

  playMusic(theme = "theme") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  // game loop
  update(time: number, delta: number): void {
    if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
      this.jump();
    } else if (this.player?.body.blocked.down) {
      this.jumpTween?.stop();
      this.player.rotation = 0;
      // ground
    }

    this.trees.tilePositionX += this.backgroundSpeed * 4;
    this.trees2.tilePositionX += this.backgroundSpeed * 2;
  }

  jump() {
    if (!this.player?.body.blocked.down) return;
    this.player.body.setVelocityY(-600);

    this.playAudio("jump");
    this.player.anims.play("rara-flip");
    this.player.playAfterRepeat("rara");
  }

  finishScene() {
    this.theme.stop();
    this.playAudio("dead");

    this.anims.pauseAll();
    this.tweens.killAll();
    this.physics.pause();
    this.backgroundSpeed = 0;
    this.generator.setRunning(false);

    this.cameras.main.shake(500, 0.0125);

    this.registry.set("score", "" + this.score);

    this.time.delayedCall(1000, () => {
      this.scene.start("GameOver");
    });
  }

  /*
    This method is called every 100ms and it is used to update the score and show it on the screen.
    */
  updateScore(points = 1) {
    this.score += points;
    this.scoreText?.setText(this.score.toString().padStart(9, "0"));
  }
}
