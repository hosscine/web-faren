const SIDEBAR_WIDTH = 200
// const SIDEBAR_MARGINE = 5

class StrategySideBar extends createjs.Container {
  constructor(playerMaster) {
    super()

    this.player = playerMaster

    this.setup()
  }

  setup() {
    this.x = contentWidthDefault - SIDEBAR_WIDTH
    this.y = HEADER_HEIGTH
    let background = this.addChild(new createjs.Shape())
    background.graphics.beginFill("darkblue")
      .drawRect(0, 0, SIDEBAR_WIDTH, contentHeightDefault - HEADER_HEIGTH)

    this.setupMaster()
    this.setupAreaInfo()

  }

  setupMaster() {
    this.masterContainer = this.addChild(new createjs.Container())

    let face = this.masterContainer.addChild(this.player.faceBitmap)
    face.scaleX = face.scaleY = face.x = face.y = 1
    face.children[1].scaleX = face.children[1].scaleY = 2
    face.children[1].x += 60

    let texty = 0
    this.income = this.masterContainer.addChild(new createjs.Text("収入 0Ley", "15px arial", "white"))
    this.income.x = 100
    this.income.y = texty += 5

    this.salary = this.masterContainer.addChild(new createjs.Text("人材費 0Ley", "15px arial", "white"))
    this.salary.x = 100
    this.salary.y = texty += 20

    this.fund = this.masterContainer.addChild(new createjs.Text("軍資金 0Ley", "15px arial", "white"))
    this.fund.x = 100
    this.fund.y = texty += 20

    this.revenue = this.masterContainer.addChild(new createjs.Text("( +0Ley )", "15px arial", "white"))
    this.revenue.x = 100
    this.revenue.y = texty += 20

    // let flag = this.masterContainer.addChild(new MotionBitmap(this.player.flag.canvas, FLAG_SIZE, FLAG_SIZE, FLAG_MOTION_INTERVAL))
    // flag.x = 125
    // flag.y = 60
  }

  setupAreaInfo() {
    this.areaInfoContainer = this.addChild(new createjs.Container())
    this.areaInfoContainer.y = 150

    let infoLabel = this.areaInfoContainer.addChild(new createjs.Text("エリア情報", "15px arial", "white"))
    let texty = 0

    let rect = this.areaInfoContainer.addChild(new createjs.Shape())
    rect.graphics.beginStroke("white").drawRoundRect(5, texty += 18, SIDEBAR_WIDTH - 10, 80, 3)

    this.areaIncome = this.areaInfoContainer.addChild(new createjs.Text("収入  0", "15px arial", "white"))
    this.areaIncome.x = 20
    this.areaIncome.y = texty += 9

    this.nfamily = this.areaInfoContainer.addChild(new createjs.Text("同種族  0人", "15px arial", "white"))
    this.nfamily.x = 100
    this.nfamily.y = texty

    this.transportation = this.areaInfoContainer.addChild(new createjs.Text("交通  ×", "15px arial", "white"))
    this.transportation.x = 20
    this.transportation.y = texty += 25

    this.wall = this.areaInfoContainer.addChild(new createjs.Text("城壁 100/100", "15px arial", "white"))
    this.wall.x = 100
    this.wall.y = texty

    this.city = this.areaInfoContainer.addChild(new createjs.Text("街 100/100", "15px arial", "white"))
    this.city.x = 20
    this.city.y = texty += 20

    this.road = this.areaInfoContainer.addChild(new createjs.Text("道路 100/100", "15px arial", "white"))
    this.road.x = 100
    this.road.y = texty
  }

  setCurrentArea(area) {

  }
}
