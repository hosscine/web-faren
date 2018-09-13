class MotionBitmap extends createjs.Container {
  constructor(imageOrUri, motionWidth, motionHeight, motionInterval) {
    super()

    this.bitmap = this.addChild(new createjs.Bitmap(imageOrUri))
    this.bitmap.mask = new createjs.Shape()

    this.maskSettings = []
    this.motionWidth = motionWidth
    this.motinHeight = motionHeight
    this.motionInterval = motionInterval
    this.currentMotion = 0

    this.bitmap.mask.graphics.beginStroke("#000").drawRect(0, 0, this.motionWidth, this.motinHeight)
    this.setupMotionMasks()
  }

  startMotion() {
    createjs.Tween.get(this, { loop: -1 })
      .wait(this.motionInterval)
      .call(this.incrementMortion)
  }

  setupMotionMasks() {
    let bounds = this.bitmap.getBounds()
    let widthFrames = bounds.width / this.motionWidth
    let heightFrames = bounds.height / this.motinHeight
    this.maskSettings = []

    for (let i = 0; i < widthFrames; i++)
      for (let j = 0; j < heightFrames; j++)
        this.maskSettings.push({
          x: i * this.motionWidth,
          y: j * this.motinHeight
        })

    this.startMotion()
  }

  setMortion(number) {
    this.bitmap.x += this.maskSettings[this.currentMotion].x - this.maskSettings[number].x
    this.bitmap.y += this.maskSettings[this.currentMotion].y - this.maskSettings[number].y
    this.currentMotion = number
  }

  incrementMortion() {
    if (this.currentMotion + 1 >= this.maskSettings.length) this.setMortion(0)
    else this.setMortion(this.currentMotion + 1)
  }

}
