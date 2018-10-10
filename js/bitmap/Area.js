const MAX_AREA_UNITS = 20
const LEVEL_INITIAL_FUND_MAGNIFICATION = [3, 5, 7, 10, 14]

class Area {
  constructor(data, owner, allAreas, assets, sidebar, gameLevel) {
    this.owner = owner
    owner.dominateArea(this)
    this.allAreas = allAreas
    this.assets = assets
    this._stayingUnits = []
    this.sidebar = sidebar
    this.gameLevel = gameLevel

    for (let i in data) this[i] = data[i]
  }

  setupAreaStatus() {
    if (this.isStayingMaster) {
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
    this.stayingCommand = { developing: true, training: false, searching: false, laying: false, building: false }
  }

  set city(value) { this._city = value > this.maxCity ? this.maxCity : value }
  get city() { return Math.round(this._city) }
  set road(value) { this._road = value > this.maxRoad ? this.maxRoad : value }
  get road() { return Math.floor(this._road) }
  set wall(value) { this._wall = value > this.maxWall ? this.maxWall : value }
  get wall() { return Math.round(this._wall) }
  get isBestTransport() { return this._road === this.maxRoad }
  get income() { return Math.round((this.basicIncome + (this.city / 4)) * (this.isBestTransport ? 2 : 1)) }
  get outgo() { return this.stayingUnits.reduce((a, x) => a + x.salary, 0) }

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
    container.on("click", () => this.sidebar[this.sidebar.areaCallbacks.click](this))

    return container
  }

  getLineTo(targetArea) {
    let line = new createjs.Shape()
    line.graphics.beginStroke("red").setStrokeStyle(2)
      .moveTo(this.x + FLAG_ROOT_X, this.y + FLAG_ROOT_Y)
      .lineTo(targetArea.x + FLAG_ROOT_X, targetArea.y + FLAG_ROOT_Y)
    return line
  }

  get stayingUnits() { return this._stayingUnits.slice() }

  registerUnit(unit) {
    if (unit.stayingArea === this) this._stayingUnits.push(unit)
    else if (!unit.stayingArea) unit.moveToArea(this)
    else throw new Error("this method cannot overwrite the location of a unit")
  }

  releaseUnit(unit) {
    if (unit.stayingArea === this) {
      let i = this._stayingUnits.indexOf(unit)
      this._stayingUnits.splice(i, 1)
    }
    else throw new Error("the unit is not staying in this area")
  }

  sortStayingUnits() {
    this._stayingUnits.sort((a, b) => { // 戦力指数, 獲得経験値でソート
      return -(a.competence - b.competence + (a.earnedExperience - b.earnedExperience) * 0.001)
    })
  }

  getStayingUnits20Bins() {
    let bins = this.stayingUnits.slice()
    return bins.concat(Array(20 - bins.length).fill(0))
  }
  setStayingUnits20Bins(bins) {
    let units = bins.filter(unit => unit !== 0)
    for (let unit of units) {
      if (unit.onMove) unit.onMove = unit.active = false
      unit.moveToArea(this)
    }
    this.sortStayingUnits()
  }

  initialEmployment() {
    let fund = 0
    if (this.isStayingMaster) fund += 150 // 本拠地補正
    if (this.isSafetyArea) fund -= 250 // 安全地帯補正
    if (this.owner.isPlayer) fund += 320 + Math.random() * 80
    else if (this.owner.isMaster) fund += 350 + Math.random() * 50
    else fund += (this.guardsMagnification * this.levelMagnification * (35 + Math.random() * 90)) / 100

    let newUnits = this.owner.initialEmploy(fund, this.stayingUnits.length, this.assets, this.initialEmployable)
    for (let unit of newUnits) unit.moveToArea(this)
    this.sortStayingUnits()
    this.setupAreaStatus()
  }

  executeAreaCommand() {
    if (this.command === "developing") this.city += this.nActiveFamily / 4
    else if (this.command === "training") {
      for (let unit of this.stayingUnits)
        if (unit.active) unit.earnedExperience += 8 - unit.rank + Math.random() * (12 - this.gameLevel * 2)
    }
    else if (this.command === "searching") return 0
    else if (this.command === "laying") this.road += this.nActiveFamily * 0.4
    else if (this.command === "building") this.wall += this.nActiveFamily
    else console.log(this, このエリアではコマンドが指定されていません)
  }

  occupied(newOwner, newUnits) {
    this.owner.releaseArea(this)
    newOwner.dominateArea(this)
    this.owner = newOwner
    for (let unit of newUnits) unit.moveToArea(this)
    this.sortStayingUnits()
  }

  unemployUnit(unit) { this._stayingUnits.splice(this._stayingUnits.indexOf(unit), 1) }

  get employable() { return this.assets.callable.employable[this.type] }
  get initialEmployable() { return this.assets.callable.initialEmployable[this.type] }

  get levelMagnification() { return LEVEL_INITIAL_FUND_MAGNIFICATION[this.gameLevel] }

  get isStayingMaster() {
    for (let unit of this.stayingUnits) if (unit.isMaster) return true
    return false
  }
  get isSafetyArea() {
    for (let adjacent of this.adjacency) if (this.allAreas[adjacent - 1].owner !== this.owner) return false
    return true
  }
  get hasSpace() { return this.stayingUnits.length < 20 }
  get nFamily() { return this.stayingUnits.reduce((a, unit) => a + (unit.species === this.owner.species ? 1 : 0), 0) }
  get nActiveFamily() {
    return this.stayingUnits.reduce((a, unit) => a + (unit.species === this.owner.species && unit.active ? 1 : 0), 0)
  }

  set command(command) { for (let key in this.stayingCommand) this.stayingCommand[key] = key === command ? true : false }
  get command() { for (let key in this.stayingCommand) if (this.stayingCommand[key]) return key }

  get adjacentAreas() { return this.adjacency.map(x => this.allAreas[x - 1]) }
  isAdjacent(area) { return this.adjacency.includes(this.allAreas.indexOf(area) + 1) }
}
