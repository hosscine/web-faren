const FLAG_SIZE = 32
const FLAG_MOTION_INTERVAL = 1000

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
}
