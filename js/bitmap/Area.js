const MAX_AREA_UNITS = 20
const LEVEL_INITIAL_FUND_MAGNIFICATION = [3, 5, 7, 10, 14]

class Area {
  constructor(data, owner, allAreas, assets, sidebar, gameLevel) {
    this.owner = owner
    this.allAreas = allAreas
    this.assets = assets
    this.stayingUnits = []
    this.sidebar = sidebar
    this.gameLevel = gameLevel

    for (let i in data) this[i] = data[i]
  }

  setupAreaStatus() {
    if (this.stayMaster) {
      this.city = this.maxCity / 3
      this.road = this.maxRoad / 3
      this.wall = this.maxWall

    }
    else if (this.owner.isMaster) {
      this.city = this.maxCity / 6
      this.road = this.maxRoad / 6
      this.wall = (this.maxWall * (this.initialWall + 40)) / 100

    }
    else {
      this.city = this.maxCity / 10
      this.road = this.maxRoad / 10
      this.wall = (this.maxWall * this.initialWall) / 100
    }
  }

  set city(value) {
    this._city = value > this.maxCity ? this.maxCity : Math.round(value)
  }
  get city() {
    return this._city
  }

  set road(value) {
    this._road = value > this.maxRoad ? this.maxRoad : Math.round(value)
  }
  get road() {
    return this._road
  }

  set wall(value) {
    this._wall = value > this.maxWall ? this.maxWall : Math.round(value)
  }
  get wall() {
    return this._wall
  }

  get isBestTransport() {
    return this._road === this.maxRoad
  }

  get income() {
    return Math.round((this.basicIncome + (this.city / 4)) * (this.isBestTransport ? 2 : 1))
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
    container.addChild(this.owner.flagBitmap)
    container.on("click", () => this.handleClick())

    return container
  }

  handleClick() {
    this.sidebar.displayArea(this)
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
    else if(this.owner.isMaster) fund += 350 + Math.random() * 50
    else fund += (this.guardsMagnification * this.levelMagnification * (35 + Math.random() * 90)) / 100

    this.placeUnits(this.owner.initialEmploy(
      fund, this.stayingUnits.length, this.assets, this.initialEmployable))

    this.sortStayingUnits()
    this.setupAreaStatus()
  }

  sortStayingUnits() {
    this.stayingUnits.sort((a, b) => { // 戦力指数, 獲得経験値でソート
      return -(a.competence - b.competence + (a.earnedExperience - b.earnedExperience) * 0.001)
    })
  }

  get employable() {
    return this.assets.callable.employable[this.type]
  }

  get initialEmployable() {
    return this.assets.callable.initialEmployable[this.type]
  }

  get levelMagnification() {
    return LEVEL_INITIAL_FUND_MAGNIFICATION[this.gameLevel]
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
