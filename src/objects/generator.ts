export default class Generator {
  scene: Phaser.Scene;
  obstacles: Phaser.GameObjects.Group;
  coins: Phaser.GameObjects.Group;
  running: boolean;

  constructor(
    scene: Phaser.Scene,
    obstacles: Phaser.GameObjects.Group,
    coins: Phaser.GameObjects.Group,
  ) {
    this.scene = scene;
    this.obstacles = obstacles;
    this.coins = coins;
    this.running = true;
    this.scene.time.delayedCall(2000, () => this.init(), undefined, this);
  }

  init() {
    this.generateCloud();
    this.generateCoin();
    this.scene.time.delayedCall(
      500,
      () => this.generateObstacle(),
      undefined,
      this,
    );
    this.scene.time.delayedCall(
      4500,
      () => this.generateRooted(),
      undefined,
      this,
    );
  }

  setRunning(value: boolean) {
    this.running = value;
  }

  generateCloud() {
    new Cloud(this.scene, 800, Phaser.Math.Between(0, 100));
    this.scene.time.delayedCall(
      Phaser.Math.Between(2000, 3000),
      () => (this.running ? this.generateCloud() : null),
      undefined,
      this,
    );
  }

  generateObstacle() {
    this.obstacles.add(
      new Obstacle(
        this.scene,
        800,
        this.scene.renderer.height - Phaser.Math.Between(32, 128),
      ),
    );
    this.scene.time.delayedCall(
      Phaser.Math.Between(1500, 4500),
      () => {
        this.running ? this.generateObstacle() : null;
      },
      undefined,
      this,
    );
  }

  generateRooted() {
    this.obstacles.add(
      new Rooted(this.scene, 800, this.scene.renderer.height - 16),
    );
    this.scene.time.delayedCall(
      Phaser.Math.Between(3500, 7500),
      () => {
        this.running ? this.generateRooted() : null;
      },
      undefined,
      this,
    );
  }

  generateCoin() {
    this.coins.add(
      new Coin(
        this.scene,
        800,
        this.scene.renderer.height - Phaser.Math.Between(32, 128),
      ),
    );
    this.scene.time.delayedCall(
      Phaser.Math.Between(500, 1500),
      () => {
        this.running ? this.generateCoin() : null;
      },
      undefined,
      this,
    );
  }
}

/*
This is a game object that represents a cloud. It's a simple rectangle with a random size and position. We use a tween to move it from right to left, and then destroy it when it's out of the screen.
*/
class Cloud extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const finalY = y || Phaser.Math.Between(0, 100);
    const alpha = 1 / Phaser.Math.Between(1, 3);

    super(scene, x, finalY, "cloud");
    scene.add.existing(this);
    this.setScale(alpha);
    this.init();
  }

  init() {
    this.scene.tweens.add({
      targets: this,
      x: { from: 900, to: -100 },
      duration: 2500 / this.scale,
      onComplete: () => {
        this.destroy();
      },
    });
  }
}

/*
This is a game object that represents an obstacle. It works exactly like the cloud, but it's a red rectangle that is part of the obstacles group that we created in the `game` scene. It can kill the player if it touches it.
*/
class Obstacle extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "tomato");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setCircle(16, 0, 0);
    this.init();
  }

  init() {
    this.scene.tweens.add({
      targets: this,
      x: { from: 900, to: -100 },
      duration: 2500,
      onComplete: () => {
        this.destroy();
      },
    });

    this.anims.play("tomato");
  }
}

// Obstacle that hops out of the ground, custom world bounds to allow physics
class Rooted extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const bounds = new Phaser.Geom.Rectangle(-100, 0, 1200, 300);
    super(scene, x, y, "rooted");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setBoundsRectangle(bounds);
    this.init();
  }

  init() {
    this.scene.time.delayedCall(
      150,
      () => {
        this.body.setVelocityY(-250);
      },
      undefined,
      this,
    );
    this.scene.tweens.add({
      targets: this,
      x: { from: 900, to: -100 },
      duration: 2500,
      onComplete: () => {
        this.destroy();
      },
    });

    this.anims.play("rooted-sprout");
    this.playAfterRepeat("rooted-idle");
  }
}

/*
This is a game object that represents a coin. It's an animated sprite that is part of the coins group that we created in the `game` scene. It moves like the previous cloud and the obstacle objects.

It can increase the player's score if it touches it.
*/
class Coin extends Phaser.GameObjects.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "coin");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.init();
  }

  init() {
    this.scene.tweens.add({
      targets: this,
      x: { from: 900, to: -100 },
      duration: 2500,
      onComplete: () => {
        this.destroy();
      },
    });

    this.anims.play("coin");
  }
}
