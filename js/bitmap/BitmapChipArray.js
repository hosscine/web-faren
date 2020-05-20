class BitmapChipArray extends Array {
  constructor(imageOrUri, chipSize) {
    super(imageOrUri)
    this.bitmap = new createjs.Bitmap(imageOrUri)
    this.chipSize = chipSize
    this.setup()
  }
  
  setup() {
    this.maskPresets = []
    this.numChips = 0
    // maskPresetsとnumChips計算
    this.analyzeBitmap(this.bitmap, this.chipSize)

    this.bitmapChips = []
    this.generateBitmapChips()
  }

  analyzeBitmap(bitmap, chipSize) {
    let bounds = bitmap.getBounds()
    let hFrames = bounds.width / chipSize
    let vFrames = bounds.height / chipSize
    let maskPresets = []

    for (let h = 0; h < hFrames; h++)
      for (let v = 0; v < vFrames; v++)
        maskPresets.push({
          x: h * chipSize,
          y: v * chipSize
        })

    this.maskPresets = maskPresets
    this.numChips = hFrames * vFrames
  }

  generateBitmapChips() {
    for (let i = 0; i < this.numChips; i++) {
      let chip = this.bitmap.clone()
      chip.mask = new createjs.Shape()

      chip.mask.graphics
        .beginStroke("#000")
        .drawRect(this.maskPresets[i], this.maskPresets[i], this.chipSize, this.chipSize)

      this.bitmapChips.push(chip)
    }
  }

  get(id) {
    return this.bitmapChips[id]
  }
}