class MapChipSelector extends createjs.Container{
  constructor(size) {
    super()

    this.shape = this.addChild(this.sizeNRectangle(size))
  }
  
  setup() {
  }

  sizeNRectangle(size) {
    let r
    switch (size) {
      case 1: 
        r = this.size1Rectangle()
        break
      case 2:
        r = this.size2Rectangle()
        break
      case 3:
        r = this.size3Rectangle()
        break
      default:
        console.log("undefined map chip selector size:", size)
    }
    return(r)
  }
  
  size1Rectangle() {
    let r = new createjs.Shape()
    r.graphics.beginStroke("red")
      .setStrokeStyle(2)
      .moveTo(0, 0)
      .lineTo(MINI_CHIP_SIZE, 0)
      .lineTo(MINI_CHIP_SIZE, MINI_CHIP_SIZE)
      .lineTo(0, MINI_CHIP_SIZE)
      .lineTo(0, 0)

    return(r)
  }

  size2Rectangle() {
    let r = new createjs.Shape()
    r.graphics.beginStroke("red")
      .setStrokeStyle(2)
      .moveTo(0, 0)
      .lineTo(MINI_CHIP_SIZE * 2, 0)
      .lineTo(MINI_CHIP_SIZE * 2, MINI_CHIP_SIZE)
      .lineTo(MINI_CHIP_SIZE * 2 + HALF_CHIP_SIZE, MINI_CHIP_SIZE)
      .lineTo(MINI_CHIP_SIZE * 2 + HALF_CHIP_SIZE, MINI_CHIP_SIZE * 2)
      .lineTo(MINI_CHIP_SIZE * 2, MINI_CHIP_SIZE * 2)
      .lineTo(MINI_CHIP_SIZE * 2, MINI_CHIP_SIZE * 3)
      .lineTo(0, MINI_CHIP_SIZE * 3)
      .lineTo(0, MINI_CHIP_SIZE * 2)
      .lineTo(-HALF_CHIP_SIZE, MINI_CHIP_SIZE * 2)
      .lineTo(-HALF_CHIP_SIZE, MINI_CHIP_SIZE * 1)
      .lineTo(0, MINI_CHIP_SIZE * 1)
      .lineTo(0, 0)
    
      this.regX = HALF_CHIP_SIZE
      this.regY = MINI_CHIP_SIZE
      return(r)
  }

  size3Rectangle() {
    let r = new createjs.Shape()
    r.graphics.beginStroke("red")
      .setStrokeStyle(2)
      .moveTo(0, 0)
      .lineTo(MINI_CHIP_SIZE * 3, 0)
      .lineTo(MINI_CHIP_SIZE * 3, MINI_CHIP_SIZE)
      .lineTo(MINI_CHIP_SIZE * 3 + HALF_CHIP_SIZE, MINI_CHIP_SIZE)
      .lineTo(MINI_CHIP_SIZE * 3 + HALF_CHIP_SIZE, MINI_CHIP_SIZE * 2)
      .lineTo(MINI_CHIP_SIZE * 3 + HALF_CHIP_SIZE, MINI_CHIP_SIZE * 2)
      .lineTo(MINI_CHIP_SIZE * 3 + MINI_CHIP_SIZE, MINI_CHIP_SIZE * 2)
      .lineTo(MINI_CHIP_SIZE * 3 + MINI_CHIP_SIZE, MINI_CHIP_SIZE * 3)
      .lineTo(MINI_CHIP_SIZE * 3 + HALF_CHIP_SIZE, MINI_CHIP_SIZE * 3)
      .lineTo(MINI_CHIP_SIZE * 3 + HALF_CHIP_SIZE, MINI_CHIP_SIZE * 4)
      .lineTo(MINI_CHIP_SIZE * 3, MINI_CHIP_SIZE * 4)
      .lineTo(MINI_CHIP_SIZE * 3, MINI_CHIP_SIZE * 5)
      .lineTo(0, MINI_CHIP_SIZE * 5)
      .lineTo(0, MINI_CHIP_SIZE * 4)
      .lineTo(-HALF_CHIP_SIZE, MINI_CHIP_SIZE * 4)
      .lineTo(-HALF_CHIP_SIZE, MINI_CHIP_SIZE * 3)
      .lineTo(-MINI_CHIP_SIZE, MINI_CHIP_SIZE * 3)
      .lineTo(-MINI_CHIP_SIZE, MINI_CHIP_SIZE * 2)
      .lineTo(-HALF_CHIP_SIZE, MINI_CHIP_SIZE * 2)
      .lineTo(-HALF_CHIP_SIZE, MINI_CHIP_SIZE)
      .lineTo(0, MINI_CHIP_SIZE)
      .lineTo(0, 0)

      this.regX = MINI_CHIP_SIZE
      this.regY = MINI_CHIP_SIZE * 2
      return(r)
  }
}