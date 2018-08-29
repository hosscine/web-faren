const FLAG_SIZE = 32
const FLAG_MOTION_INTERVAL = 1000
const FLAG_ROOT_X = 7
const FLAG_ROOT_Y = 30

class Area {
  constructor(data, owner) {
    this.owner = owner
    for (let i in data) this[i] = data[i]
  }

  get ownerFlag() {
    let flag = new MotionBitmap(this.owner.flag.canvas, FLAG_SIZE, FLAG_SIZE, FLAG_MOTION_INTERVAL)
    flag.x = this.x
    flag.y = this.y
    return flag
  }

  getLineTo(targetArea) {
    let line = new createjs.Shape()
    line.graphics.beginStroke("red").setStrokeStyle(2)
      .moveTo(this.x + FLAG_ROOT_X, this.y + FLAG_ROOT_Y)
      .lineTo(targetArea.x + FLAG_ROOT_X, targetArea.y + FLAG_ROOT_Y)
    return line
  }
}
