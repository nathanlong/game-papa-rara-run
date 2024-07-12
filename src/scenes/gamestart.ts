export default class GameStart extends Phaser.Scene {
  width: number;
  height: number;
  center_width: number;
  center_height: number;

  declare input: Phaser.Input.InputPlugin;

  constructor() {
    super({ key: "GameStart" });
  }

  preload() {
    this.load.audio("coin", "assets/sounds/coin.mp3");
    this.load.audio("jump", "assets/sounds/jump.mp3");
    this.load.audio("dead", "assets/sounds/dead.mp3");
    // this.load.audio("theme", "assets/sounds/theme.mp3");
    this.load.audio(
      "theme",
      "assets/sounds/ready-set-drift-michael-grubb-end-clipped.mp3",
    );
    this.load.audio("end", "assets/sounds/floating-cat-michael-grubb.mp3");

    this.load.spritesheet("coin", "./assets/images/coin.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("papa", "./assets/images/papa-rara.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("tomato", "./assets/images/tomato.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("rooted", "./assets/images/rooted.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image("cloud", "./assets/images/cloud.png");
    this.load.image("trees", "./assets/images/trees-01.png");
    this.load.image("trees2", "./assets/images/trees-02.png");
    this.load.image("mountains", "./assets/images/mountains.png");
    this.load.image("title", "./assets/images/title-card.png");

    this.load.bitmapFont(
      "arcade",
      "assets/fonts/arcade.png",
      "assets/fonts/arcade.xml",
    );
    this.load.bitmapFont(
      "mario",
      "assets/fonts/mario.png",
      "assets/fonts/mario.xml",
    );
  }

  create() {
    this.width = parseInt(this.sys.game.config.width);
    this.height = parseInt(this.sys.game.config.height);
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    // store in registry to get later
    this.registry.set("width", this.width);
    this.registry.set("height", this.height);
    this.registry.set("center_width", this.center_width);
    this.registry.set("center_height", this.center_height);

    this.cameras.main.setBackgroundColor(0x87ceeb);

    this.mountains = this.add
      .tileSprite(0, 0, 900, 300, "mountains")
      .setOrigin(0, 0);
    this.title = this.add.image(0, 0, "title").setOrigin(0, 0);

    this.titleTween = this.tweens.add({
      targets: this.title,
      duration: 2000,
      y: 2,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    this.add
      .bitmapText(
        this.center_width,
        235,
        "mario",
        "Press SPACE or Click to Start!",
        18,
      )
      .setOrigin(0.5);

    this.add
      .bitmapText(
        this.center_width,
        270,
        "mario",
        "Code and Art by Nathan Long - Music by Michael Grubb",
        8,
      )
      .setOrigin(0.5);

    this.input.keyboard?.on("keydown-SPACE", this.startGame, this);
    this.input.on("pointerdown", () => this.startGame(), this);
  }

  showLine(text: string, y: number) {
    const line = this.add
      .bitmapText(this.center_width, y, "pixelFont", text, 25)
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: line,
      duration: 2000,
      alpha: 1,
    });
  }

  startGame() {
    this.scene.start("Game");
  }
}
