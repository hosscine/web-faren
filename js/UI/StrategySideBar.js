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
    this.setupUnitOverviewContainer()
    this.setupUnitDetailContainer()
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
    if (this.flag) this.undisplayUnitDetauil()
    this.flag = true

    let unitBitmap = this.unitDetailContainer.addChild(new createjs.Bitmap(unit.unitImage.canvas))
    unitBitmap.x = 10
    unitBitmap.y = 17
  }

  undisplayUnitDetauil() {
    this.unitDetailContainer.removeChildAt(this.unitDetailContainer.children.length - 1)
  }

  displayUnitOverview(unit) {
    this.overviewData.name.text = unit.name
    this.overviewData.species.text = unit.strSpecies
    this.overviewData.rank.text = "Rank " + unit.strRank
    this.overviewData.experience.text = "Exp " + unit.earnedExperience
    this.overviewData.nattackBuff.text = unit.buff.nattack === 1 ? " " : unit.buff.nattack === 2 ? "攻撃増" : "攻撃減"
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

  setupUnitOverviewContainer() {
    let unitOverviewContainer = this.addChild(new createjs.Container())
    this.unitOverviewContainer = unitOverviewContainer
    unitOverviewContainer.y = 600

    let rect = unitOverviewContainer.addChild(new createjs.Shape())
    rect.graphics.beginStroke("white").drawRect(5, 0, SIDEBAR_WIDTH - 10, 118)

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

    let nattackBuff = unitOverviewContainer.addChild(new createjs.Text("攻撃増", "14px arial", "white"))
    nattackBuff.x = 10
    nattackBuff.y = contentY += 15

    let HP = unitOverviewContainer.addChild(new createjs.Text("HP 100/100", "14px arial", "white"))
    HP.x = 10
    HP.y = contentY += 15

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
      name: name, species: species, rank: rank, experience: experience, nattackBuff: nattackBuff, HP: HP, MP: MP,
      physicalStrength: physicalStrength, physicalResistance: physicalResistance, technique: technique,
      agility: agility, magicalStrength: magicalStrength, magicalResistance: magicalResistance
    }
  }

  setupUnitDetailContainer() {
    let unitDetailContainer = this.addChild(new createjs.Container())
    this.unitDetailContainer = unitDetailContainer

    let background = unitDetailContainer.addChild(new createjs.Shape())
    background.graphics.beginFill("darkblue").drawRect(0, 0, SIDEBAR_WIDTH, 500)
    background.graphics.beginStroke("white").drawRect(5, 5, SIDEBAR_WIDTH - 10, 500)

    let detailContentsContainer = unitDetailContainer.addChild(new createjs.Container())
    
    let contentY = 0
    let name = detailContentsContainer.addChild(new createjs.Text("ファイアジャイアント", "15px arial", "white"))
    name.x = 45
    name.y = contentY += 8

    let species = detailContentsContainer.addChild(new createjs.Text("人間系", "14px arial", "white"))
    species.x = 50
    species.y = contentY += 20

    let named = detailContentsContainer.addChild(new createjs.Text("（人材）", "14px arial", "white"))
    named.x = 120
    named.y = contentY

    let rank = detailContentsContainer.addChild(new createjs.Text("Rank S", "14px arial", "white"))
    rank.x = 50
    rank.y = contentY += 15

    let experience = detailContentsContainer.addChild(new createjs.Text("Exp 100", "14px arial", "white"))
    experience.x = 120
    experience.y = contentY

    const contentX = 40
    const contentX2 = 105
    let lHP = detailContentsContainer.addChild(new createjs.Text("HP", "14px arial", "white"))
    let HP = detailContentsContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    lHP.x = contentX
    HP.x = contentX2
    lHP.y = HP.y = contentY += 20

    let lMP = detailContentsContainer.addChild(new createjs.Text("MP", "14px arial", "white"))
    let MP = detailContentsContainer.addChild(new createjs.Text(" 10/ 10", "14px Courier New", "white"))
    lMP.x = contentX
    MP.x = contentX2
    lMP.y = MP.y = contentY += 15

    let lphysicalStrength = detailContentsContainer.addChild(new createjs.Text("攻撃力", "14px arial", "white"))
    let physicalStrength = detailContentsContainer.addChild(new createjs.Text(" 10/ 10", "14px Courier New", "white"))
    lphysicalStrength.x = contentX
    physicalStrength.x = contentX2
    lphysicalStrength.y = physicalStrength.y = contentY += 15

    let lphysicalResistance = detailContentsContainer.addChild(new createjs.Text("防御力", "14px arial", "white"))
    let physicalResistance = detailContentsContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    lphysicalResistance.x = contentX
    physicalResistance.x = contentX2
    lphysicalResistance.y = physicalResistance.y = contentY += 15

    let ltechnique = detailContentsContainer.addChild(new createjs.Text("技量", "14px arial", "white"))
    let technique = detailContentsContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    ltechnique.x = contentX
    technique.x = contentX2
    ltechnique.y = technique.y = contentY += 15

    let lagility = detailContentsContainer.addChild(new createjs.Text("素早さ", "14px arial", "white"))
    let agility = detailContentsContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    lagility.x = contentX
    agility.x = contentX2
    lagility.y = agility.y = contentY += 15

    let lmagicalStrength = detailContentsContainer.addChild(new createjs.Text("魔力", "14px arial", "white"))
    let magicalStrength = detailContentsContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    lmagicalStrength.x = contentX
    magicalStrength.x = contentX2
    lmagicalStrength.y = magicalStrength.y = contentY += 15

    let lmagicalResistance = detailContentsContainer.addChild(new createjs.Text("抵抗力", "14px arial", "white"))
    let magicalResistance = detailContentsContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    lmagicalResistance.x = contentX
    magicalResistance.x = contentX2
    lmagicalResistance.y = magicalResistance.y = contentY += 15

    let lMPrecover = detailContentsContainer.addChild(new createjs.Text("HP再生", "14px arial", "white"))
    let MPrecover = detailContentsContainer.addChild(new createjs.Text(" 10/ 10", "14px Courier New", "white"))
    lMPrecover.x = contentX
    MPrecover.x = contentX2
    lMPrecover.y = MPrecover.y = contentY += 15

    let lHPrecover = detailContentsContainer.addChild(new createjs.Text("MP再生", "14px arial", "white"))
    let HPrecover = detailContentsContainer.addChild(new createjs.Text(" 10/ 10", "14px Courier New", "white"))
    lHPrecover.x = contentX
    HPrecover.x = contentX2
    lHPrecover.y = HPrecover.y = contentY += 15

    const magicMargine = 22
    let magicFire = detailContentsContainer.addChild(new createjs.Text("火\nＳ", "14px arial", "white"))
    magicFire.x = 38
    magicFire.y = contentY += 25

    let magicAqua = detailContentsContainer.addChild(new createjs.Text("水\n✖", "14px arial", "white"))
    magicAqua.x = magicFire.x + magicMargine
    magicAqua.y = contentY

    let magicWind = detailContentsContainer.addChild(new createjs.Text("風\n✖", "14px arial", "white"))
    magicWind.x = magicAqua.x + magicMargine
    magicWind.y = contentY

    let magicEarth = detailContentsContainer.addChild(new createjs.Text("土\n✖", "14px arial", "white"))
    magicEarth.x = magicWind.x + magicMargine
    magicEarth.y = contentY

    let magicLight = detailContentsContainer.addChild(new createjs.Text("光\n✖", "14px arial", "white"))
    magicLight.x = magicEarth.x + magicMargine
    magicLight.y = contentY

    let magicDark = detailContentsContainer.addChild(new createjs.Text("闇\n✖", "14px arial", "white"))
    magicDark.x = magicLight.x + magicMargine
    magicDark.y = contentY

    let attackTimes = detailContentsContainer.addChild(new createjs.Text("攻撃 × 3", "14px arial", "white"))
    attackTimes.x = 30
    attackTimes.y = contentY += 45

    let attackTypes = detailContentsContainer.addChild(new createjs.Text("（通常 神聖 毒）", "14px arial", "white"))
    attackTypes.x = 30
    attackTypes.y = contentY += 15

    let uniqueSkil = detailContentsContainer.addChild(new createjs.Text("弓矢 × 3", "14px arial", "white"))
    uniqueSkil.x = 30
    uniqueSkil.y = contentY += 15

    let moveType = detailContentsContainer.addChild(new createjs.Text("移動タイプ：飛行タイプ", "14px arial", "white"))
    moveType.x = 25
    moveType.y = contentY += 30

    let moveRange = detailContentsContainer.addChild(new createjs.Text("　　移動力：10", "14px arial", "white"))
    moveRange.x = 25
    moveRange.y = contentY += 15

    let resist = detailContentsContainer.addChild(new createjs.Text("石化攻撃に強い\n即死攻撃に強い", "14px arial", "white"))
    resist.x = 50
    resist.y = contentY += 30

    let lkillStats = detailContentsContainer.addChild(new createjs.Text("撃破数", "14px arial", "white"))
    let killStats = detailContentsContainer.addChild(new createjs.Text("100", "14px Courier New", "white"))
    lkillStats.x = 45
    killStats.x = 125
    lkillStats.y = killStats.y = contentY += resist.getMeasuredHeight() + 17
    
    let lcost = detailContentsContainer.addChild(new createjs.Text("人材費", "14px arial", "white"))
    let cost = detailContentsContainer.addChild(new createjs.Text("  5", "14px Courier New", "white"))
    lcost.x = 45
    cost.x = 125
    lcost.y = cost.y = contentY += 15
  }

  formatValue(value) {
    return " ".repeat(-(value.toString().length - 3)) + value
  }

}