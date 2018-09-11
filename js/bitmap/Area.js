class Area {
  constructor(data, owner) {
    this.owner = owner
    for (let i in data) this[i] = data[i]
  }

  get ownerNameFlag() {
    let container = new createjs.Container()
    container.x = this.x
    container.y = this.y

    let text = new createjs.Text(this.name, "15px arial", "white")
    text.textAlign = "center"
    text.x += 10
    text.y += FLAG_SIZE
    let outlineText = text.clone()
    outlineText.color = "black"
    outlineText.outline = 2
    container.addChild(outlineText, text)

    console.log(this.owner)
    let flag = container.addChild(this.owner.flagBitmap)

    return container
  }

  getLineTo(targetArea) {
    let line = new createjs.Shape()
    line.graphics.beginStroke("red").setStrokeStyle(2)
      .moveTo(this.x + FLAG_ROOT_X, this.y + FLAG_ROOT_Y)
      .lineTo(targetArea.x + FLAG_ROOT_X, targetArea.y + FLAG_ROOT_Y)
    return line
  }
}
