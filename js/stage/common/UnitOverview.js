
class UnitOverview extends createjs.Container {
  constructor() {
    super()
    this.setup()
  }

  setup() {
    let unitOverviewContainer = this.addChild(new createjs.Container())
    this.unitOverviewContainer = unitOverviewContainer
    unitOverviewContainer.y = 600
    unitOverviewContainer.visible = false

    let rect = unitOverviewContainer.addChild(new createjs.Shape())
    rect.graphics.beginStroke("white").beginFill("darkblue").drawRect(5, 0, SIDEBAR_WIDTH - 10, 118)

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
}