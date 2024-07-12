class Player extends Phaser.GameObjects.Sprite {
  jumping: boolean;
  invincible: boolean;
  health: number;
  declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x:number, y:number) {
    super(scene, x, y, "papa");
    this.setOrigin(0.5);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true)
    this.setScale(1);
    this.jumping = false;
    this.invincible = false;
    this.health = 10;
    this.body.mass = 10;
    this.body.setDragY(10);
    this.anims.play("rara");
    this.setDepth(2);
  }
}

export default Player;
