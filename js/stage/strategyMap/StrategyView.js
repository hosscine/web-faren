class StrategyView extends createjs.Container {
  constructor(vmodel, playerMaster) {
    super()
    this.vmodel = vmodel
    this.setup(playerMaster)
    this.unitDetail = this.addChild(new UnitDetail())
    this.unitOverview = this.addChild(new UnitOverview())
  }

  setup(master) {
    this.setupMasterView(master)
    this.setupTurnCommands()
    this.setupAreaView()
    this.setupAreaCommands()
    this.setupUnitCommands()
    this.setupUnitsView()
  }

  get columnHeight() {
    let containers = [this.masterContainer, this.areaInfoContainer]
    return containers.reduce((sum, c) => sum + c.columnHeight, 0)
  }
  get height() { return this.getBounds().height }

  selectAreaCommand(choise) {
    for (let key in this.areaCommands)
      this.areaCommands[key].selected = key === choise ? true : false
  }

  set commandsVisible(bool) {
    this.areaCommandsContainer.visible = this.unitCommandsContainer.visible = bool
  }
  get commandsVisible() { return this.areaCommandsContainer.visible }

  displayMaster(master) {
    this.masterData.income.text = "収入 " + master.income + "Ley"
    this.masterData.salary.text = "人材費 " + master.outgo + "Ley"
    this.masterData.fund.text = "軍資金 " + master.fund + "Ley"
    this.masterData.revenue.text = "( +" + (master.income - master.outgo) + "Ley )"
  }

  displayArea(area) {
    this.areaData.name.text = area.name
    this.areaData.income.text = "収入  " + area.income
    this.areaData.nFamily.text = "同種族  " + area.nFamily + "人"
    this.areaData.transportation.text = "交通  " + (area.isBestTransport ? "〇" : "×")
    this.areaData.wall.text = "城壁 " + area.wall + "/" + area.maxWall
    this.areaData.city.text = "街 " + area.city + "/" + area.maxCity
    this.areaData.road.text = "道路 " + area.road + "/" + area.maxRoad
  }

  displayUnitBitmaps(bitmaps, borderColor = "white", target = "staying") {
    let container = this[target + "UnitsContainer"]
    this.destinationUnitsContainer.visible = target === "destination"
    container.removeAllChildren()

    let borderRect = container.addChild(new createjs.Shape())
    borderRect.graphics.beginStroke(borderColor).setStrokeStyle(borderColor === "white" ? 1 : 4)
      .drawRoundRect(5, 0, SIDEBAR_CONTENT_WIDTH - 10, 175, 5)

    // if (units === null) return
    let [x, y] = [12, 10]
    for (let bitmap of bitmaps) {
      if (bitmap !== 0) {
        bitmap.x = x
        bitmap.y = y
        container.addChild(bitmap)
      }

      x += 36
      if (x > SIDEBAR_CONTENT_WIDTH - 35) {
        x = 12
        y += 40
      }
    }
  }

  displayUnitOverview(unit) { this.unitOverview.display(unit) }
  undisplayUnitOverview(unit) { this.unitOverview.undisplay(unit) }
  displayUnitDetail(unit) { this.unitDetail.display(unit) }

  setupMasterView(master) {
    let container = this.addChild(new createjs.Container())
    container.columnHeight = 190
    this.masterContainer = container

    let face = container.addChild(master.faceBitmap)
    face.scaleX = face.scaleY = 1
    face.y = 5

    let contentY = 0
    let flag = container.addChild(master.flagBitmap)
    flag.x = 110
    flag.y = 7

    let income = container.addChild(new createjs.Text("収入 0Ley", "15px arial", "white"))
    income.x = 100
    income.y = contentY += 45

    let salary = container.addChild(new createjs.Text("人材費 0Ley", "15px arial", "white"))
    salary.x = 100
    salary.y = contentY += 20

    let fund = container.addChild(new createjs.Text("軍資金 0Ley", "15px arial", "white"))
    fund.x = 100
    fund.y = contentY += 20

    let revenue = container.addChild(new createjs.Text("( +0Ley )", "15px arial", "white"))
    revenue.x = 100
    revenue.y = contentY += 20

    let name = container.addChild(new createjs.Text(master.name, "15px arial", "white"))
    name.textAlign = "center"
    name.x = 50
    name.y = 105

    this.masterData = {
      income: income, salary: salary, fund: fund, revenue: revenue, name: name
    }
  }

  setupTurnCommands() {
    let container = this.addChild(new createjs.Container())
    container.y = 133

    let contentX = 0
    const buttonSize = 45
    let war = container.addChild(new Button("⚔", buttonSize, buttonSize))
    war.x = contentX += 4
    war.on("click", () => this.vmodel.handleWar())

    let alliance = container.addChild(new Button("🤝", buttonSize, buttonSize))
    alliance.x = contentX += buttonSize + 4

    let extension = container.addChild(new Button("👐", buttonSize, buttonSize))
    extension.x = contentX += buttonSize + 4

    let turnEnd = container.addChild(new Button("😴", buttonSize, buttonSize))
    turnEnd.x = contentX += buttonSize + 4
    turnEnd.on("click", () => this.vmodel.handleTurnEnd())

    for (let button of container.children) {
      button.font = "40px arial"
      button.alignText()
    }
  }

  setupAreaView() {
    let container = this.addChild(new createjs.Container())
    container.columnHeight = 100
    container.y = 190
    this.areaInfoContainer = container

    let name = container.addChild(new createjs.Text("自宅", "15px arial", "white"))
    name.x = 10
    let contentY = 0

    let rect = container.addChild(new createjs.Shape())
    rect.graphics.beginStroke("white").drawRoundRect(5, contentY += 18, SIDEBAR_CONTENT_WIDTH - 10, 80, 5)

    let income = container.addChild(new createjs.Text("収入  0", "15px arial", "white"))
    income.x = 20
    income.y = contentY += 10

    let nFamily = container.addChild(new createjs.Text("同種族  0人", "15px arial", "white"))
    nFamily.x = 100
    nFamily.y = contentY

    let transportation = container.addChild(new createjs.Text("交通  ×", "15px arial", "white"))
    transportation.x = 20
    transportation.y = contentY += 25

    let wall = container.addChild(new createjs.Text("城壁 100/100", "15px arial", "white"))
    wall.x = 100
    wall.y = contentY

    let city = container.addChild(new createjs.Text("街 100/100", "15px arial", "white"))
    city.x = 20
    city.y = contentY += 20

    let road = container.addChild(new createjs.Text("道路 100/100", "15px arial", "white"))
    road.x = 100
    road.y = contentY

    this.areaData = {
      name: name, income: income, nFamily: nFamily,
      transportation: transportation, wall: wall, city: city, road: road
    }
  }

  setupAreaCommands() {
    let container = this.addChild(new createjs.Container())
    container.y = 300
    this.areaCommandsContainer = container

    const BUTTON_WIDTH = 85
    const LEFT_X = 10
    const RIGHT_X = 110
    let contentY = 0
    let stayLabel = container.addChild(new createjs.Text("待機時の行動", "15px arial", "white"))
    stayLabel.x = 10

    let developing = container.addChild(new Button("街開発", BUTTON_WIDTH, 20))
    developing.x = RIGHT_X
    developing.selected = true

    let training = container.addChild(new Button("部隊訓練", BUTTON_WIDTH, 20))
    training.x = LEFT_X
    training.y = contentY += 23

    let searching = container.addChild(new Button("人材捜索", BUTTON_WIDTH, 20))
    searching.x = RIGHT_X
    searching.y = contentY

    let laying = container.addChild(new Button("道路建設", BUTTON_WIDTH, 20))
    laying.x = LEFT_X
    laying.y = contentY += 23

    let building = container.addChild(new Button("城壁建設", BUTTON_WIDTH, 20))
    building.x = RIGHT_X
    building.y = contentY

    this.areaCommands = {
      developing: developing, training: training, searching: searching,
      laying: laying, building: building
    }
    for (let key in this.areaCommands)
      this.areaCommands[key].on("click", () => this.vmodel.handleAreaCommand(key))
  }

  setupUnitsView() {
    this.stayingUnitsContainer = this.addChild(new createjs.Container())
    this.stayingUnitsContainer.y = 400
    this.destinationUnitsContainer = this.addChild(new createjs.Container())
    this.destinationUnitsContainer.y = 600
  }

  setupMoveCommands() {
    let container = this.addChild(new createjs.Container())
    container.y = 577
    container.visible = false
    this.moveCommandsContainer = container

    let contentX = 5
    const buttonSize = 60
    let under = container.addChild(new Button("全て下へ", buttonSize + 10, 20))
    under.x = contentX
    under.on("click", () => this.vmodel.handleAllMove("toUnder"))

    let submit = container.addChild(new Button("確定", buttonSize - 20, 20))
    submit.x = contentX += buttonSize + 15
    submit.on("click", () => this.vmodel.handleMoveSubmit())

    let above = container.addChild(new Button("全て上へ", buttonSize + 10, 20))
    above.x = contentX += buttonSize - 15
    above.on("click", () => this.vmodel.handleAllMove("toAbove"))
  }

  setupUnitCommands() {
    let container = this.addChild(new createjs.Container())
    container.y = 370
    this.unitCommandsContainer = container

    let contentX = 7
    const buttonSize = 25
    let move = container.addChild(new Button("🚶", buttonSize, buttonSize))
    move.x = contentX += 4
    move.on("click", () => this.vmodel.handleMove())

    let employ = container.addChild(new Button("📥", buttonSize, buttonSize))
    employ.x = contentX += buttonSize + 4
    employ.on("click", () => this.vmodel.handleEmploy())

    let unemploy = container.addChild(new Button("📤", buttonSize, buttonSize))
    unemploy.x = contentX += buttonSize + 4
    unemploy.on("click", () => this.vmodel.handleUnemploy())

    let cancel = container.addChild(new Button("🏸", buttonSize, buttonSize))
    cancel.x = contentX += buttonSize + 16
    cancel.on("click", () => this.vmodel.handleReset())

    for (let button of container.children) button.font = "20px arial"
  }
}