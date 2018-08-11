class ScenarioReader {
  constructor(path) {
    super()

    this.batBitmap = batBitmap
    this.defaultRotation = defaultRotation
    this.targetBall = targetBall
    this.hitBox
    this.isMoving = false
    this.swingPower = 5
    this.difficulty = DIFFICULTY_EASY // default = 5

    this.setup()
  }

  setup() {
    this.batBitmap.scaleX = this.batBitmap.scaleY = 1 / 2

    this.addChild(this.batBitmap)

    this.hitBox = this.addChild(new createjs.Shape())
    let b = this.batBitmap.getBounds()
    let b2 = new createjs.Rectangle(b.x, b.y, b.width / 2, b.height / 2)
    this.hitBox.setBounds(this.batBitmap.getBounds() / 2)

    this.hitBox.graphics.beginFill("black")
      .drawRect(b2.x, b2.y, b2.width, b2.height)
    this.hitBox.alpha = 0.5
    this.hitBox.visible = false

    this.rotation = this.defaultRotation
  }

  swing(rotation) {
    if (this.isMoving) return
    this.isMoving = true
    let tween = createjs.Tween.get(this)
    tween.to({
        rotation: rotation
      }, 250)
      .wait(1000)
      .to({
        rotation: this.defaultRotation
      }, 500)
      .call(() => this.isMoving = false)
    createjs.Ticker.setFPS(60)

    let handleChange = (event) => {
      let point = this.targetBall.localToLocal(0, 0, this.hitBox)
      if (!this.hitBox.hitTest(point.x, point.y) ||
        this.targetBall.moveEnergy > 0) return

      let flyToward = new createjs.Point(
        Math.sin(this.rotation / 360 * Math.PI * this.difficulty),
        -Math.cos(this.rotation / 360 * Math.PI * this.difficulty)
      )
      let flyForce = this.swingPower

      createjs.Tween.removeTweens(this.targetBall)
      tween.off("change", handleChange)
      this.targetBall.fly(flyToward, flyForce)
    }
    tween.on("change", handleChange)
  }
}

window.Bat = createjs.promote(Bat, "Container")
