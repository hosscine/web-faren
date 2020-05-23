class BitmapChips {
  constructor(imageOrUri, chipSize) {
    this.sourceImageOrUri = imageOrUri
    this.chipSize = chipSize
    this.setup()
  }
  
  setup() {
    this.maskPresets = []
    this.numChips = 0
    // maskPresetsとnumChipsを計算
    this.analyzeBitmap(this.sourceBitmap, this.chipSize)
  }

  analyzeBitmap(bitmap, chipSize) {
    let hFrames = this.sourceImageOrUri.width / chipSize
    let vFrames = this.sourceImageOrUri.height / chipSize
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

  getChip(id) {
    let container = new createjs.Container()
    let chip = container.addChild(new createjs.Bitmap(this.sourceImageOrUri))
    chip.mask = new createjs.Shape()

    chip.mask.graphics
      .beginStroke("#000")
      .drawRect(0, 0, this.chipSize, this.chipSize)    

    chip.regX = this.maskPresets[id].x
    chip.regY = this.maskPresets[id].y

    return container
  }
}