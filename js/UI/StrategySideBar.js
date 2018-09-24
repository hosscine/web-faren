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

    this.setupMasterContainer()
    this.setupAreaInfoContainer()
    this.setupAreaCommandContainer()
    this.setupStayingUnitsContainer()
    this.setupUnitOverview()
  }

  displayArea(area) {
    this.areaIncome.text = "収入  " + area.income
    this.nfamily.text = "同種族  " + 0 + "人"
    this.transportation.text = "交通  " + (area.isBestTransport ? "〇" : "×")
    this.wall.text = "城壁 " + area.wall + "/" + area.maxWall
    this.city.text = "街 " + area.city + "/" + area.maxCity
    this.road.text = "道路 " + area.road + "/" + area.maxRoad

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

  displayUnitDetail(unit) {
    
  }

  displayUnitOverview(unit) {
    this.overviewData.name.text = unit.name
    this.overviewData.species.text = unit.strSpecies
    this.overviewData.rank.text = "Rank " + unit.strRank
    this.overviewData.experience.text = "Exp" + unit.earnedExperience
    this.overviewData.HP.text = "HP  " + unit.HP + " / " + unit.basic.HP
    this.overviewData.MP.text = "MP  " + unit.MP + " / " + unit.basic.MP
    this.overviewData.physicalStrength.text = "攻撃 " + unit.physicalStrength
    this.overviewData.physicalResistance.text = "防御 " + unit.physicalResistance
    this.overviewData.technique.text = "技量 " + unit.technique
    this.overviewData.agility.text = "速さ " + unit.agility
    this.overviewData.magicalStrength.text = "魔力 " + unit.magicalStrength
    this.overviewData.magicalResistance.text = "抵抗 " + unit.magicalResistance

    let unitBitmap = this.unitOverviewContainer.addChild(new createjs.Bitmap(unit.unitImage.canvas))
    unitBitmap.x = SIDEBAR_WIDTH - 40
    unitBitmap.y = 3

    this.unitOverviewContainer.visible = true
  }

  undisplayUnitOverview() {
    this.unitOverviewContainer.visible = false
    this.unitOverviewContainer.removeChildAt(this.unitOverviewContainer.children.length - 1)
  }

  setupMasterContainer() {
    this.masterContainer = this.addChild(new createjs.Container())

    let face = this.masterContainer.addChild(this.player.faceBitmap)
    face.scaleX = face.scaleY = face.x = face.y = 1

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

  setupAreaInfoContainer() {
    this.areaInfoContainer = this.addChild(new createjs.Container())
    this.areaInfoContainer.y = 150

    let infoLabel = this.areaInfoContainer.addChild(new createjs.Text("エリア情報", "15px arial", "white"))
    let contentY = 0

    let rect = this.areaInfoContainer.addChild(new createjs.Shape())
    rect.graphics.beginStroke("white").drawRoundRect(5, contentY += 18, SIDEBAR_WIDTH - 10, 80, 5)

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

  setupUnitOverview() {
    let unitOverviewContainer = this.addChild(new createjs.Container())
    this.unitOverviewContainer = unitOverviewContainer
    unitOverviewContainer.y = 600

    let rect = unitOverviewContainer.addChild(new createjs.Shape())
    rect.graphics.beginStroke("white").drawRect(5, 0, SIDEBAR_WIDTH - 10, 105)

    let contentY = 0
    let name = unitOverviewContainer.addChild(new createjs.Text("ファイアジャイアント", "15px arial", "white"))
    name.x = 10
    name.y = contentY += 3

    let species = unitOverviewContainer.addChild(new createjs.Text("人間系", "14px arial", "white"))
    species.x = 10
    species.y = contentY += 20

    let rank = unitOverviewContainer.addChild(new createjs.Text("Rank S", "14px arial", "white"))
    rank.x = 10
    rank.y = contentY += 15

    let experience = unitOverviewContainer.addChild(new createjs.Text("Exp 100", "14px arial", "white"))
    experience.x = 70
    experience.y = contentY

    let HP = unitOverviewContainer.addChild(new createjs.Text("HP 100/100", "14px arial", "white"))
    HP.x = 10
    HP.y = contentY += 20

    let MP = unitOverviewContainer.addChild(new createjs.Text("MP 100/100", "14px arial", "white"))
    MP.x = 100
    MP.y = contentY

    let physicalStrength = unitOverviewContainer.addChild(new createjs.Text("攻撃 100", "14px arial", "white"))
    physicalStrength.x = 10
    physicalStrength.y = contentY += 15

    let physicalResistance = unitOverviewContainer.addChild(new createjs.Text("防御 100", "14px arial", "white"))
    physicalResistance.x = 75
    physicalResistance.y = contentY

    let technique = unitOverviewContainer.addChild(new createjs.Text("技量 100", "14px arial", "white"))
    technique.x = 135
    technique.y = contentY

    let agility = unitOverviewContainer.addChild(new createjs.Text("速さ 100", "14px arial", "white"))
    agility.x = 10
    agility.y = contentY += 15

    let magicalStrength = unitOverviewContainer.addChild(new createjs.Text("魔力 100", "14px arial", "white"))
    magicalStrength.x = 75
    magicalStrength.y = contentY

    let magicalResistance = unitOverviewContainer.addChild(new createjs.Text("抵抗 100", "14px arial", "white"))
    magicalResistance.x = 135
    magicalResistance.y = contentY

    this.overviewData = {
      name: name, species: species, rank: rank, experience: experience, HP: HP, MP: MP,
      physicalStrength: physicalStrength, physicalResistance: physicalResistance, technique: technique,
      agility: agility, magicalStrength: magicalStrength, magicalResistance: magicalResistance
    }
  }

}