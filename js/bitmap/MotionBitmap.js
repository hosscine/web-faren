class MotionBitmap extends createjs.Bitmap {
  constructor(imageOrUri, motionWidth, motionHeight, motionInterval) {
    super(imageOrUri)

    this.mask = new createjs.Shape()
    this.masks = []
    this.motionWidth = motionWidth
    this.motinHeight = motionHeight
    this.motionInterval = motionInterval
    this.currentMotion = 0
  }

  startMotion() {
    createjs.Tween.get(this, {
        loop: -1
      })
      .wait(this.motionInterval)
      .call(this.incrementMortion)
  }

  setupMotionMasks() {
    let bounds = this.getBounds()
    let widthFrames = bounds.width / this.motionWidth
    let heightFrames = bounds.height / this.motinHeight
    this.masks = []

    for (let i = 0; i < widthFrames; i++)
      for (let j = 0; j < heightFrames; j++)
        this.masks.push({
          x: i * this.motionWidth,
          y: j * this.motinHeight
        })

    this.setupMaskPosition()
    this.startMotion()
  }

  setupMaskPosition() {
    this.mask.graphics.beginStroke("#000").drawRect(this.x, this.y, this.motionWidth, this.motinHeight)
  }

  setMortion(number) {
    this.x += this.masks[this.currentMotion].x - this.masks[number].x
    this.y += this.masks[this.currentMotion].y - this.masks[number].y
    this.currentMotion = number
  }

  incrementMortion() {
    if (this.currentMotion + 1 >= this.masks.length) this.setMortion(0)
    else this.setMortion(this.currentMotion + 1)
  }

}
