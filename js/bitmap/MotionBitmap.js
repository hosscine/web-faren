class MotionBitmap extends createjs.Bitmap {
  constructor(imageOrUri, motionWidth, motionHeight) {
    let data = new createjs.BitmapData(imageOrUri)
    super(data.canvas)

    this.data = data
    this.masks = []
    this.motionWidth = motionWidth
    this.motinHeight = motionHeight
    this.currentMotion = 0

    this.setupAlphaChannel()
    // this.setupMotionMasks()
  }

  setupAlphaChannel() {
    for (let i = 0; i < this.data.width; i++)
      for (let j = 0; j < this.data.height; j++)
        if (this.data.getPixel(i, j) === 0) this.data.setPixel32(i, j, 0x00000000)
    this.data.updateContext()
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

    this.mask = new createjs.Shape()
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
