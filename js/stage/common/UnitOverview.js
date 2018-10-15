class UnitOverview extends createjs.Container {
  constructor() {
    super()
    this.setup()
  }

  undisplay() {
    this.container.visible = false
    this.container.removeChildAt(this.container.children.length - 1)
  }

  display(unit) {
    this.data.name.text = unit.name
    this.data.species.text = unit.strSpecies
    this.data.rank.text = "Rank " + unit.strRank
    this.data.experience.text = "Exp " + unit.earnedExperience
    this.data.nattackBuff.text = unit.buff.nattack === 1 ? " " : unit.buff.nattack === 2 ? "攻撃増" : "攻撃減"
    this.data.HP.text = "HP  " + unit.HP + " / " + unit.basic.HP
    this.data.MP.text = "MP  " + unit.MP + " / " + unit.basic.MP
    this.data.physicalStrength.text = "攻撃 " + unit.physicalStrength
    this.data.physicalResistance.text = "防御 " + unit.physicalResistance
    this.data.technique.text = "技量 " + unit.technique
    this.data.agility.text = "速さ " + unit.agility
    this.data.magicalStrength.text = "魔力 " + unit.magicalStrength
    this.data.magicalResistance.text = "抵抗 " + unit.magicalResistance

    let unitBitmap = this.container.addChild(new createjs.Bitmap(unit.unitImage.canvas))
    unitBitmap.x = SIDEBAR_CONTENT_WIDTH - 40
    unitBitmap.y = 3

    this.container.visible = true
  }

  setup() {
    let container = this.addChild(new createjs.Container())
    this.container = container
    container.visible = false

    let rect = container.addChild(new createjs.Shape())
    rect.graphics.beginStroke("white").beginFill("darkblue").drawRect(5, 0, SIDEBAR_CONTENT_WIDTH - 10, 118)

    let contentY = 0
    let name = container.addChild(new createjs.Text("ファイアジャイアント", "15px arial", "white"))
    name.x = 10
    name.y = contentY += 3

    let species = container.addChild(new createjs.Text("人間系", "14px arial", "white"))
    species.x = 10
    species.y = contentY += 20

    let rank = container.addChild(new createjs.Text("Rank S", "14px arial", "white"))
    rank.x = 10
    rank.y = contentY += 15

    let experience = container.addChild(new createjs.Text("Exp 100", "14px arial", "white"))
    experience.x = 70
    experience.y = contentY

    let nattackBuff = container.addChild(new createjs.Text("攻撃増", "14px arial", "white"))
    nattackBuff.x = 10
    nattackBuff.y = contentY += 15

    let HP = container.addChild(new createjs.Text("HP 100/100", "14px arial", "white"))
    HP.x = 10
    HP.y = contentY += 15

    let MP = container.addChild(new createjs.Text("MP 100/100", "14px arial", "white"))
    MP.x = 100
    MP.y = contentY

    let physicalStrength = container.addChild(new createjs.Text("攻撃 100", "14px arial", "white"))
    physicalStrength.x = 10
    physicalStrength.y = contentY += 15

    let physicalResistance = container.addChild(new createjs.Text("防御 100", "14px arial", "white"))
    physicalResistance.x = 75
    physicalResistance.y = contentY

    let technique = container.addChild(new createjs.Text("技量 100", "14px arial", "white"))
    technique.x = 135
    technique.y = contentY

    let agility = container.addChild(new createjs.Text("速さ 100", "14px arial", "white"))
    agility.x = 10
    agility.y = contentY += 15

    let magicalStrength = container.addChild(new createjs.Text("魔力 100", "14px arial", "white"))
    magicalStrength.x = 75
    magicalStrength.y = contentY

    let magicalResistance = container.addChild(new createjs.Text("抵抗 100", "14px arial", "white"))
    magicalResistance.x = 135
    magicalResistance.y = contentY

    this.data = {
      name: name, species: species, rank: rank, experience: experience, nattackBuff: nattackBuff, HP: HP, MP: MP,
      physicalStrength: physicalStrength, physicalResistance: physicalResistance, technique: technique,
      agility: agility, magicalStrength: magicalStrength, magicalResistance: magicalResistance
    }
  }
}