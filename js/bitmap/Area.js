const MAX_AREA_UNITS = 20

class Area {
  constructor(data, owner, allAreas, assets) {
    this.owner = owner
    this.allAreas = allAreas
    this.assets = assets
    this.stayingUnits = []
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

  placeUnits(units) {
    return this.stayingUnits = this.stayingUnits.concat(units)
  }

  initialEmployment() {
    let fund = 0 
    if (this.stayMaster) fund += 150 // 本拠地補正
    if (this.isSafetyArea) fund -= 250 // 安全地帯補正
    if (this.owner.isPlayer) fund += 320 + Math.random() * 80
    else fund += 350 + Math.random() * 50

    if (!this.owner.isNeutral)
      this.placeUnits(this.owner.initialEmploy(fund, this.stayingUnits.length, this.assets))
    // empcost = (area.m_inhabitcost * inhcost[m_GameLevel - 1] * (35 + mtrand_n(90))) / 100;
    // rank = m_GameLevel / 2;
    // idlist = &area.m_inhabit;
  }

  get stayMaster() {
    for (let unit of this.stayingUnits) if (unit.isMaster) return true
    return false
  }

  get isSafetyArea() {
    for (let adjacent of this.adjacency) if (this.allAreas[adjacent - 1].owner !== this.owner) return false
    return true
  }
}
