class BitmapChips {
  constructor(imageOrUri, chipSize) {
    this.vastBitmap = new createjs.Bitmap(imageOrUri)
    this.chipSize = chipSize
    this.setup()
  }
  
  setup() {
    this.maskPresets = []
    this.numChips = 0
    // maskPresetsとnumChipsを計算
    this.analyzeBitmap(this.vastBitmap, this.chipSize)

    this.bitmapChips = []
    this.splitBitmapChips()
  }

  analyzeBitmap(bitmap, chipSize) {
    let bounds = bitmap.getBounds()
    let hFrames = bounds.width / chipSize
    let vFrames = bounds.height / chipSize
    let maskPresets = []

    for (let v = 0; v < vFrames; v++)
      for (let h = 0; h < hFrames; h++)
        maskPresets.push({
          x: h * chipSize,
          y: v * chipSize
        })

    this.maskPresets = maskPresets
    this.numChips = hFrames * vFrames
  }

  splitBitmapChips() {
    for (let i = 0; i < this.numChips; i++) {
      let chip = this.vastBitmap.clone()
      chip.mask = new createjs.Shape()

      chip.mask.graphics
        .beginStroke("#000")
        .drawRect(0, 0, this.chipSize, this.chipSize)    

      chip.regX = this.maskPresets[i].x
      chip.regY = this.maskPresets[i].y
      this.bitmapChips.push(chip)
    }
  }

  getChip(id) {
    console.log(this.maskPresets[id])
    return this.bitmapChips[id]
  }
}