class StrategySideBar extends SideBar {
  constructor(playerMaster, mainStage, assets) {
    super(playerMaster)
    this.mainStage = mainStage
    this.assets = assets

    this.setup()
  }

  setup() {
    this.setupMasterContainer()
    this.setupTurnCommandsContainer()
    this.setupAreaInfoContainer()
    this.setupAreaCommandsContainer()
    this.setupUnitCommandsContainer()
    this.setupUnitsContainer()
    super.setupUnitOverviewContainer()
    super.setupUnitDetailContainer()
  }

  displayMaster() {
    this.masterData.income.text = "収入 " + this.player.income + "Ley"
    this.masterData.salary.text = "人材費 " + this.player.outgo + "Ley"
    this.masterData.fund.text = "軍資金 " + this.player.fund + "Ley"
    this.masterData.revenue.text = "( +" + (this.player.income - this.player.outgo) + "Ley )"
  }

  displayArea(area) {
    this.displayingArea = area
    this.areaData.name.text = area.name
    this.areaData.income.text = "収入  " + area.income
    this.areaData.nFamily.text = "同種族  " + area.nFamily + "人"
    this.areaData.transportation.text = "交通  " + (area.isBestTransport ? "〇" : "×")
    this.areaData.wall.text = "城壁 " + area.wall + "/" + area.maxWall
    this.areaData.city.text = "街 " + area.city + "/" + area.maxCity
    this.areaData.road.text = "道路 " + area.road + "/" + area.maxRoad

    this.unitCallbacks.click = "displayUnitDetail"
    this.displayUnits(area.stayingUnits, this.unitCallbacks, "white", area.owner === this.player ? "end" : null)
    this.areaCommandsContainer.visible = this.unitCommandsContainer.visible = area.owner === this.player
  }

  displayUnits(units, callbacks, color = "white", badge = "end", target = "staying") {
    let container = this[target + "UnitsContainer"]
    container.removeAllChildren()
    let rect = container.addChild(new createjs.Shape())
    rect.graphics.beginStroke(color).setStrokeStyle(color === "white" ? 1 : 4).drawRoundRect(5, 0, SIDEBAR_WIDTH - 10, 175, 5)

    this.areaCallbacks.click = "displayArea"
    this.destinationUnitsContainer.visible = target === "destination"

    if (units === null) return
    let x = 12
    let y = 10
    for (let unit of units) {
      if (unit !== 0) {
        let bitmap = unit.getUnitBitmap(this, callbacks, badge)
        bitmap.x = x
        bitmap.y = y
        container.addChild(bitmap)
      }

      x += 36
      if (x > SIDEBAR_WIDTH - 35) {
        x = 12
        y += 40
      }
    }
  }

  displayUnitsBoth({ unitClick, areaClick, unitsFrom, colorFrom, badgeFrom,
    unitsTo = unitsFrom, colorTo = colorFrom, badgeTo = badgeFrom } = {}) {
    this.unitCallbacks.click = unitClick
    this.displayUnits(unitsFrom, this.unitCallbacks, colorFrom, badgeFrom)
    this.displayUnits(unitsTo, this.unitCallbacks, colorTo, badgeTo, "destination")
    this.areaCallbacks.click = areaClick
  }

  displayUnitOverview(unit) {
    if (this.moveToUnits) if (this.moveToUnits.includes(unit)) return super.displayUnitOverview(unit, 400)
    super.displayUnitOverview(unit, 600)
  }

  selectAreaCommand(selected) {
    for (let key in this.areaCommands) this.areaCommands[key].selected = key === selected ? true : false
    this.displayingArea.command = selected
  }

  resetMode() {
    if (this.binsSet) for (let key in this.binsSet)
      this.binsSet[key].forEach(unit => { if (unit !== 0) unit.onMove = false })
    if (this.moveFromUnits) this.moveFromUnits.forEach(unit => { if (unit !== 0) unit.onMove = false })
    if (this.moveToUnits) this.moveToUnits.forEach(unit => { if (unit !== 0) unit.onMove = false })
    this.destinationArea = this.warTargetArea = this.moveFromUnits = this.moveToUnits = this.binsSet = undefined
    this.displayArea(this.displayingArea)
    this.moveCommandsContainer.visible = false
  }

  initializeBinsSet() {
    this.binsSet = {}
    for (let area of this.displayingArea.adjacentAreas) this.binsSet[area.name] = area.getStayingUnits20Bins()
    this.binsSet[this.displayingArea.name] = this.displayingArea.getStayingUnits20Bins()
  }

  switchWarMode() {
    this.resetMode()
    if (this.displayingArea.owner !== this.player) return alert("先に侵攻元の自軍のエリアを選択してください")
    this.initializeBinsSet()
    this.moveToUnits = Array(20).fill(0)

    this.displayUnitsBoth({
      unitClick: "displayUnitDetail", areaClick: "displayWarTarget", unitsFrom: this.binsSet[this.displayingArea.name],
      colorFrom: "white", badgeFrom: "end", unitsTo: this.moveToUnits, colorTo: "ivory"
    })
  }

  displayWarTarget(area) {
    if (area.owner !== this.player && !this.displayingArea.isAdjacent(area))
      return alert("対象のエリアは侵攻元のエリアと隣接していません")

    if (area.owner === this.player) { // 侵攻元のエリアを再設定
      if (this.warTargetArea) if (!this.warTargetArea.isAdjacent(area))
        return alert("対象のエリアは侵攻先のエリアと隣接していません")
      this.displayArea(area)
    }
    else { // 侵攻先のエリアを設定
      this.switchWarMode()
      this.warTargetArea = area
    }

    if (this.warTargetArea) {
      this.moveCommandsContainer.visible = true
      this.displayUnitsBoth({
        unitClick: "commandUnitAdvancement", areaClick: "displayWarTarget",
        unitsFrom: this.binsSet[this.displayingArea.name], colorFrom: "pink", badgeFrom: "end", unitsTo: this.moveToUnits
      })
    }
    else this.switchWarMode()
  }

  commandUnitAdvancement(unit) {
    this.commandUnitMove(unit, true)
  }

  commandWarfare() {
    if (this.moveToUnits.every(unit => unit === 0)) return alert("侵攻するユニットが一体もいません")
    let go = window.confirm(this.warTargetArea.name + "に侵攻します")
    if (!go) return

    this.moveToUnits = this.moveToUnits.filter(unit => unit !== 0)
    this.mainStage.gotoBattleMap(this.warTargetArea, this.player, this.moveToUnits)
    this.resetMode()
  }

  switchMoveMode() {
    this.resetMode()
    this.displayUnitsBoth({
      unitClick: "displayUnitDetail", areaClick: "displayMoveCandidates", unitsFrom: this.displayingArea.stayingUnits,
      colorFrom: "white", badgeFrom: "end", unitsTo: null, colorTo: "yellow"
    })
  }

  displayMoveCandidates(area) {
    if (this.destinationArea) this.commandMoveSubmit() // 移動先エリアを切り替える前に移動を確定
    if (area === this.displayingArea) return alert("移動元と同じエリアです")
    else if (area.owner !== this.player) return alert("移動先は自軍のエリアを選択してください")

    this.destinationArea = area
    this.moveCommandsContainer.visible = true
    this.moveFromUnits = this.displayingArea.getStayingUnits20Bins()
    this.moveToUnits = this.destinationArea.getStayingUnits20Bins()

    this.displayUnitsBoth({
      unitClick: "commandUnitMove", areaClick: "displayMoveCandidates", unitsFrom: this.moveFromUnits,
      colorFrom: "cyan", badgeFrom: "end", unitsTo: this.moveToUnits
    })
  }

  commandUnitMove(unit, isWar = false) {
    if (!unit.active) return true
    let [from, to] = [,]
    if (this.moveToUnits.includes(unit)) {
      from = this.moveToUnits
      if (isWar) to = this.displayingArea.stayingUnits.includes(unit) ?
        this.binsSet[this.displayingArea.name] : this.binsSet[unit.stayingArea.name]
      else to = this.moveFromUnits
    }
    else {
      from = isWar ? this.binsSet[this.displayingArea.name] : this.moveFromUnits
      to = this.moveToUnits
    }

    if (to.includes(0)) {
      to[to.indexOf(0)] = unit
      from[from.indexOf(unit)] = 0
      unit.onMove = !unit.onMove

      let option = isWar ? { color: "pink", badge: "" } : { color: "cyan", badge: "move" }
      this.displayUnitsBoth({
        unitClick: isWar ? "commandUnitAdvancement" : "commandUnitMove",
        areaClick: isWar ? "displayWarTarget" : "displayMoveCandidates",
        unitsFrom: isWar ? this.binsSet[this.displayingArea.name] : this.moveFromUnits,
        colorFrom: option.color, badgeFrom: option.badge, unitsTo: this.moveToUnits
      })
      return false
    }
    return true
  }

  commandAllMoveTo(destination) {
    for (let unit of destination) if (unit.active) if (this.commandUnitMove(unit, this.warTargetArea)) break
  }

  commandMoveSubmit() {
    this.displayingArea.setStayingUnits20Bins(this.moveFromUnits)
    this.destinationArea.setStayingUnits20Bins(this.moveToUnits)
    this.resetMode()
  }

  switchEmployMode() {
    this.resetMode()
    if (!this.displayingArea.hasSpace) return alert("エリアに空きがありません")
    this.unitCallbacks.click = "displayEmployCandidates"
    this.displayUnits(this.displayingArea.stayingUnits, this.unitCallbacks, "limegreen")
  }

  displayEmployCandidates(unit) {
    if (!unit.active) return alert("既に行動済みのユニットです")
    else if (!unit.isFamily(this.player)) return alert("マスターと同種族でないユニットは雇用に従事できません")

    let candidates1 = unit.employable.concat()
    let candidates2 = this.displayingArea.employable.concat()
    for (let i in candidates1) candidates1[i] = new Unit(candidates1[i], this.assets)
    for (let i in candidates2) candidates2[i] = new Unit(candidates2[i], this.assets)
    candidates1.sort((a, b) => -(a.cost - b.cost))
    candidates2.sort((a, b) => -(a.cost - b.cost))
    let candidates = candidates1.concat(candidates2)

    this.commandingUnit = unit
    this.unitCallbacks.click = "commandEmployUnit"
    this.displayUnits(candidates, this.unitCallbacks, "red", "cost")
  }

  commandEmployUnit(unit) {
    if (this.player.pay(unit.cost)) {
      unit.moveToArea(this.displayingArea)
      this.displayingArea.sortStayingUnits()
      this.displayMaster(this.player)
      unit.active = this.commandingUnit.active = false
    }
    else alert("ユニットの雇用費を払えません")

    if (this.displayingArea.hasSpace) this.switchEmployMode()
    else this.resetMode()
  }

  switchUnemployMode() {
    this.resetMode()
    this.unitCallbacks.click = "commandUnemployUnit"
    this.displayUnits(this.displayingArea.stayingUnits, this.unitCallbacks, "red")
  }

  commandUnemployUnit(unit) {
    if (!unit.active) return alert("既に行動済みのユニットです")
    else if (unit.isMaster) return alert("マスターは解雇できません")

    let go = window.confirm("この部隊を解雇してよろしいですか？")
    if (go) this.displayingArea.unemployUnit(unit)
    this.switchUnemployMode()
  }

  setupMasterContainer() {
    this.masterContainer = this.addChild(new createjs.Container())

    let face = this.masterContainer.addChild(this.player.faceBitmap)
    face.scaleX = face.scaleY = 1
    face.y = 5

    let contentY = 0
    let flag = this.masterContainer.addChild(this.player.flagBitmap)
    flag.x = 110
    flag.y = 7

    let income = this.masterContainer.addChild(new createjs.Text("収入 0Ley", "15px arial", "white"))
    income.x = 100
    income.y = contentY += 45

    let salary = this.masterContainer.addChild(new createjs.Text("人材費 0Ley", "15px arial", "white"))
    salary.x = 100
    salary.y = contentY += 20

    let fund = this.masterContainer.addChild(new createjs.Text("軍資金 0Ley", "15px arial", "white"))
    fund.x = 100
    fund.y = contentY += 20

    let revenue = this.masterContainer.addChild(new createjs.Text("( +0Ley )", "15px arial", "white"))
    revenue.x = 100
    revenue.y = contentY += 20

    let name = this.masterContainer.addChild(new createjs.Text(this.player.name, "15px arial", "white"))
    name.textAlign = "center"
    name.x = 50
    name.y = 105

    this.masterData = {
      income: income, salary: salary, fund: fund, revenue: revenue, name: name
    }
  }

  setupTurnCommandsContainer() {
    let turnCommandsContainer = this.addChild(new createjs.Container())
    turnCommandsContainer.y = 133

    let contentX = 0
    const buttonSize = 45
    let war = turnCommandsContainer.addChild(new Button("⚔", buttonSize, buttonSize))
    war.x = contentX += 4
    war.on("click", () => this.switchWarMode())

    let alliance = turnCommandsContainer.addChild(new Button("🤝", buttonSize, buttonSize))
    alliance.x = contentX += buttonSize + 4

    let extension = turnCommandsContainer.addChild(new Button("👐", buttonSize, buttonSize))
    extension.x = contentX += buttonSize + 4

    let turnEnd = turnCommandsContainer.addChild(new Button("😴", buttonSize, buttonSize))
    turnEnd.x = contentX += buttonSize + 4
    turnEnd.on("click", () => { this.resetMode(); this.mainStage.nextMasterTurn(this.player) })

    for (let button of turnCommandsContainer.children) {
      button.font = "40px arial"
      button.alignText()
    }
  }

  setupAreaInfoContainer() {
    let areaInfoContainer = this.addChild(new createjs.Container())
    areaInfoContainer.y = 190
    this.areaInfoContainer = areaInfoContainer

    let name = areaInfoContainer.addChild(new createjs.Text("自宅", "15px arial", "white"))
    name.x = 10
    let contentY = 0

    let rect = areaInfoContainer.addChild(new createjs.Shape())
    rect.graphics.beginStroke("white").drawRoundRect(5, contentY += 18, SIDEBAR_WIDTH - 10, 80, 5)

    let income = areaInfoContainer.addChild(new createjs.Text("収入  0", "15px arial", "white"))
    income.x = 20
    income.y = contentY += 10

    let nFamily = areaInfoContainer.addChild(new createjs.Text("同種族  0人", "15px arial", "white"))
    nFamily.x = 100
    nFamily.y = contentY

    let transportation = areaInfoContainer.addChild(new createjs.Text("交通  ×", "15px arial", "white"))
    transportation.x = 20
    transportation.y = contentY += 25

    let wall = areaInfoContainer.addChild(new createjs.Text("城壁 100/100", "15px arial", "white"))
    wall.x = 100
    wall.y = contentY

    let city = areaInfoContainer.addChild(new createjs.Text("街 100/100", "15px arial", "white"))
    city.x = 20
    city.y = contentY += 20

    let road = areaInfoContainer.addChild(new createjs.Text("道路 100/100", "15px arial", "white"))
    road.x = 100
    road.y = contentY

    this.areaData = {
      name: name, income: income, nFamily: nFamily,
      transportation: transportation, wall: wall, city: city, road: road
    }
    this.areaCallbacks = { click: "displayArea" }
  }

  setupAreaCommandsContainer() {
    let areaCommandsContainer = this.addChild(new createjs.Container())
    areaCommandsContainer.y = 300
    this.areaCommandsContainer = areaCommandsContainer

    const BUTTON_WIDTH = 85
    const LEFT_X = 10
    const RIGHT_X = 110
    let contentY = 0
    let stayLabel = areaCommandsContainer.addChild(new createjs.Text("待機時の行動", "15px arial", "white"))
    stayLabel.x = 10

    let developing = areaCommandsContainer.addChild(new Button("街開発", BUTTON_WIDTH, 20))
    developing.x = RIGHT_X
    developing.selected = true

    let training = areaCommandsContainer.addChild(new Button("部隊訓練", BUTTON_WIDTH, 20))
    training.x = LEFT_X
    training.y = contentY += 23

    let searching = areaCommandsContainer.addChild(new Button("人材捜索", BUTTON_WIDTH, 20))
    searching.x = RIGHT_X
    searching.y = contentY

    let laying = areaCommandsContainer.addChild(new Button("道路建設", BUTTON_WIDTH, 20))
    laying.x = LEFT_X
    laying.y = contentY += 23

    let building = areaCommandsContainer.addChild(new Button("城壁建設", BUTTON_WIDTH, 20))
    building.x = RIGHT_X
    building.y = contentY

    this.areaCommands = {
      developing: developing, training: training, searching: searching, laying: laying, building: building
    }
    for (let key in this.areaCommands) this.areaCommands[key].on("click", () => this.selectAreaCommand(key))
  }

  setupUnitsContainer() {
    this.stayingUnitsContainer = this.addChild(new createjs.Container())
    this.stayingUnitsContainer.y = 400
    this.destinationUnitsContainer = this.addChild(new createjs.Container())
    this.destinationUnitsContainer.y = 600

    let moveCommandsContainer = this.addChild(new createjs.Container())
    moveCommandsContainer.y = 577
    moveCommandsContainer.visible = false
    this.moveCommandsContainer = moveCommandsContainer

    let contentX = 5
    const buttonSize = 60
    let under = moveCommandsContainer.addChild(new Button("全て下へ", buttonSize + 10, 20))
    under.x = contentX
    under.on("click", () => this.warTargetArea ?
      this.commandAllMoveTo(this.binsSet[this.displayingArea.name]) : this.commandAllMoveTo(this.moveFromUnits))

    let submit = moveCommandsContainer.addChild(new Button("確定", buttonSize - 20, 20))
    submit.x = contentX += buttonSize + 15
    submit.on("click", () => this.warTargetArea ? this.commandWarfare() : this.commandMoveSubmit())

    let above = moveCommandsContainer.addChild(new Button("全て上へ", buttonSize + 10, 20))
    above.x = contentX += buttonSize - 15
    above.on("click", () => this.commandAllMoveTo(this.moveToUnits))

    this.unitCallbacks = {
      click: "displayUnitDetail",
      mouseover: "displayUnitOverview",
      mouseout: "undisplayUnitOverview"
    }
  }

  setupUnitCommandsContainer() {
    let unitCommandsContainer = this.addChild(new createjs.Container())
    unitCommandsContainer.y = 370
    this.unitCommandsContainer = unitCommandsContainer

    let contentX = 7
    const buttonSize = 25
    let move = unitCommandsContainer.addChild(new Button("🚶", buttonSize, buttonSize))
    move.x = contentX += 4
    move.on("click", () => this.switchMoveMode())

    let employ = unitCommandsContainer.addChild(new Button("📥", buttonSize, buttonSize))
    employ.x = contentX += buttonSize + 4
    employ.on("click", () => this.switchEmployMode())

    let unemploy = unitCommandsContainer.addChild(new Button("📤", buttonSize, buttonSize))
    unemploy.x = contentX += buttonSize + 4
    unemploy.on("click", () => this.switchUnemployMode())

    let cancel = unitCommandsContainer.addChild(new Button("🏸", buttonSize, buttonSize))
    cancel.x = contentX += buttonSize + 16
    cancel.on("click", () => this.resetMode())

    for (let button of unitCommandsContainer.children) button.font = "20px arial"
  }
}