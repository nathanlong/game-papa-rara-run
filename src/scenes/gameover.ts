export default class GameOver extends Phaser.Scene {
  width: number;
  height: number;
  center_width: number;
  center_height: number;
  endMusic: Phaser.Sound.HTML5AudioSound;

  constructor() {
    super({ key: "GameOver" });
  }

  create() {
    this.width = this.registry.get("width");
    this.height = this.registry.get("height");
    this.center_width = this.registry.get("center_width");
    this.center_height = this.registry.get("center_height");

    this.cameras.main.setBackgroundColor(0x87ceeb);

    this.endMusic = this.sound.add("end")
    this.endMusic.play()

    this.add
      .bitmapText(
        this.center_width,
        50,
        "mario",
        this.registry.get("score"),
        25,
      )
      .setOrigin(0.5);

    this.add
      .bitmapText(
        this.center_width,
        this.center_height,
        "mario",
        "GAME OVER",
        45,
      )
      .setOrigin(0.5);

    this.add
      .bitmapText(
        this.center_width,
        250,
        "mario",
        "Press SPACE or Click to restart!",
        15,
      )
      .setOrigin(0.5);

    this.input.keyboard?.on("keydown-SPACE", this.startGame, this);
    this.input.on("pointerdown", () => this.startGame(), this);
  }

  showLine(text:string, y:number) {
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
    this.endMusic.stop()
    this.scene.start("Game");
  }
}
