const SIDEBAR_WIDTH = 200
// const SIDEBAR_MARGINE = 5

class StrategySideBar extends createjs.Container {
  constructor(playerMaster) {
    super()

    this.player = playerMaster

    this.setup()
  }

  setup() {
    let background = this.addChild(new createjs.Shape())
    background.graphics.beginFill("darkblue")
      .drawRect(0, 0, SIDEBAR_WIDTH, clientHeight)

    this.setupMaster()
    this.setupAreaInfo()
    this.setAreaCommand()

  }
  setupMaster() {
    this.masterContainer = this.addChild(new createjs.Container())

    let face = this.masterContainer.addChild(this.player.faceBitmap)
    face.scaleX = face.scaleY = face.x = face.y = 1
    face.children[1].scaleX = face.children[1].scaleY = 2
    face.children[1].x += 60

    let contentY = 0
    this.income = this.masterContainer.addChild(new createjs.Text("収入 0Ley", "15px arial", "white"))
    this.income.x = 100
    this.income.y = contentY += 5

    this.salary = this.masterContainer.addChild(new createjs.Text("人材費 0Ley", "15px arial", "white"))
    this.salary.x = 100
    this.salary.y = contentY += 20

    this.fund = this.masterContainer.addChild(new createjs.Text("軍資金 0Ley", "15px arial", "white"))
    this.fund.x = 100
    this.fund.y = contentY += 20

    this.revenue = this.masterContainer.addChild(new createjs.Text("( +0Ley )", "15px arial", "white"))
    this.revenue.x = 100
    this.revenue.y = contentY += 20

    // let flag = this.masterContainer.addChild(new MotionBitmap(this.player.flag.canvas, FLAG_SIZE, FLAG_SIZE, FLAG_MOTION_INTERVAL))
    // flag.x = 125
    // flag.y = 60
  }

  setupAreaInfo() {
    this.areaInfoContainer = this.addChild(new createjs.Container())
    this.areaInfoContainer.y = 150

    let infoLabel = this.areaInfoContainer.addChild(new createjs.Text("エリア情報", "15px arial", "white"))
    let contentY = 0

    let rect = this.areaInfoContainer.addChild(new createjs.Shape())
    rect.graphics.beginStroke("white").drawRoundRect(5, contentY += 18, SIDEBAR_WIDTH - 10, 80, 3)

    this.areaIncome = this.areaInfoContainer.addChild(new createjs.Text("収入  0", "15px arial", "white"))
    this.areaIncome.x = 20
    this.areaIncome.y = contentY += 10

    this.nfamily = this.areaInfoContainer.addChild(new createjs.Text("同種族  0人", "15px arial", "white"))
    this.nfamily.x = 100
    this.nfamily.y = contentY

    this.transportation = this.areaInfoContainer.addChild(new createjs.Text("交通  ×", "15px arial", "white"))
    this.transportation.x = 20
    this.transportation.y = contentY += 25

    this.wall = this.areaInfoContainer.addChild(new createjs.Text("城壁 100/100", "15px arial", "white"))
    this.wall.x = 100
    this.wall.y = contentY

    this.city = this.areaInfoContainer.addChild(new createjs.Text("街 100/100", "15px arial", "white"))
    this.city.x = 20
    this.city.y = contentY += 20

    this.road = this.areaInfoContainer.addChild(new createjs.Text("道路 100/100", "15px arial", "white"))
    this.road.x = 100
    this.road.y = contentY
  }

  setAreaCommand() {
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

  setCurrentArea(area) {
  }
}
