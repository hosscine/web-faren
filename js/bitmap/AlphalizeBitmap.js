class AlphalizeBitmap extends createjs.BitmapData {
  constructor(imageOrUri) {
    super(imageOrUri)

    this.setupAlphaChannel()
  }

  setupAlphaChannel() {
    for (let i = 0; i < this.width; i++)
      for (let j = 0; j < this.height; j++)
        if (this.getPixel(i, j) === 0) this.setPixel32(i, j, 0x00000000)
    this.updateContext()
  }
}
