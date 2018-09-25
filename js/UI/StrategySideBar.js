class StrategySideBar extends SideBar {
  constructor(playerMaster) {
    super(playerMaster)

    this.setup()
  }

  setup() {
    this.setupMasterContainer()
    this.setupAreaInfoContainer()
    this.setupAreaCommandContainer()
    this.setupStayingUnitsContainer()
    super.setupUnitOverviewContainer()
    super.setupUnitDetailContainer()
  }

  displayArea(area) {
    this.areaData.name.text = area.name
    this.areaData.income.text = "収入  " + area.income
    this.areaData.nfamily.text = "同種族  " + 0 + "人"
    this.areaData.transportation.text = "交通  " + (area.isBestTransport ? "〇" : "×")
    this.areaData.wall.text = "城壁 " + area.wall + "/" + area.maxWall
    this.areaData.city.text = "街 " + area.city + "/" + area.maxCity
    this.areaData.road.text = "道路 " + area.road + "/" + area.maxRoad

    this.displayUnits(area.stayingUnits)
  }

  displayUnits(units) {
    this.stayingUnitsContainer.removeAllChildren()
    let x = 12
    let y = 10

    for (let unit of units) {
      let bitmap = unit.getUnitBitmap(this)
      bitmap.x = x
      bitmap.y = y
      this.stayingUnitsContainer.addChild(bitmap)

      x += 36
      if (x > SIDEBAR_WIDTH - 35) {
        x = 12
        y += 40
      }
    }
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

  setupAreaInfoContainer() {
    let areaInfoContainer = this.addChild(new createjs.Container())
    areaInfoContainer.y = 150
    this.areaInfoContainer = areaInfoContainer

    let name = areaInfoContainer.addChild(new createjs.Text("自宅", "15px arial", "white"))
    name.x = 10
    let contentY = 0

    let rect = areaInfoContainer.addChild(new createjs.Shape())
    rect.graphics.beginStroke("white").drawRoundRect(5, contentY += 18, SIDEBAR_WIDTH - 10, 80, 5)

    let income = areaInfoContainer.addChild(new createjs.Text("収入  0", "15px arial", "white"))
    income.x = 20
    income.y = contentY += 10

    let nfamily = areaInfoContainer.addChild(new createjs.Text("同種族  0人", "15px arial", "white"))
    nfamily.x = 100
    nfamily.y = contentY

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
      name: name, income: income, nfamily: nfamily,
      transportation: transportation, wall: wall, city: city, road: road
    }
  }

  setupAreaCommandContainer() {
    this.areaCommandContainer = this.addChild(new createjs.Container())
    this.areaCommandContainer.y = 300
    this.stayCommands = {}

    const BUTTON_WIDTH = 85
    const LEFT_X = 10
    const RIGHT_X = 110
    let contentY = 0
    let stayLabel = this.areaCommandContainer.addChild(new createjs.Text("待機時の行動", "15px arial", "white"))
    stayLabel.x = 10

    this.stayCommands.developing = this.areaCommandContainer.addChild(new Button("街開発", BUTTON_WIDTH, 20))
    this.stayCommands.developing.x = RIGHT_X

    this.stayCommands.training = this.areaCommandContainer.addChild(new Button("部隊訓練", BUTTON_WIDTH, 20))
    this.stayCommands.training.x = LEFT_X
    this.stayCommands.training.y = contentY += 23

    this.stayCommands.searching = this.areaCommandContainer.addChild(new Button("人材捜索", BUTTON_WIDTH, 20))
    this.stayCommands.searching.x = RIGHT_X
    this.stayCommands.searching.y = contentY

    this.stayCommands.laying = this.areaCommandContainer.addChild(new Button("道路建設", BUTTON_WIDTH, 20))
    this.stayCommands.laying.x = LEFT_X
    this.stayCommands.laying.y = contentY += 23

    this.stayCommands.building = this.areaCommandContainer.addChild(new Button("城壁建設", BUTTON_WIDTH, 20))
    this.stayCommands.building.x = RIGHT_X
    this.stayCommands.building.y = contentY
  }

  setupStayingUnitsContainer() {
    let stayingParent = this.addChild(new createjs.Container())
    stayingParent.y = 400

    let rect = stayingParent.addChild(new createjs.Shape())
    rect.graphics.beginStroke("white").drawRoundRect(5, 0, SIDEBAR_WIDTH - 10, 175, 5)

    this.stayingUnitsContainer = stayingParent.addChild(new createjs.Container())
  }
}