const SIDEBAR_CONTENT_WIDTH = 200

class UnitDetail extends createjs.Container {
  constructor() {
    super()
    this.setup()
  }

  undisplay() {
    this.container.removeChild(this.container.faceBitmap)
    this.subContainer.removeChild(this.subContainer.unitBitmap)
    this.container.visible = false
  }

  display(unit) {
    this.undisplay()
    if (unit.faceImageID > 0) { // 顔画像があればsubContainerの位置を下にずらして表示する
      let faceBitmap = this.container.addChild(new createjs.Bitmap(unit.faceImage.canvas))
      faceBitmap.x = 50
      faceBitmap.y = 5
      this.container.faceBitmap = faceBitmap
      this.subContainer.y = 100
    }
    else this.subContainer.y = 0

    let unitBitmap = this.subContainer.addChild(new createjs.Bitmap(unit.unitImage.canvas))
    unitBitmap.x = 10
    unitBitmap.y = 17
    this.subContainer.unitBitmap = unitBitmap

    this.data.name.text = unit.name
    this.data.species.text = unit.strSpecies
    this.data.named.text = unit.isMaster || unit.characterType.named > 0 ? "（人材）" : ""
    this.data.rank.text = "Rank " + unit.strRank
    this.data.experience.text = "Exp " + unit.earnedExperience

    this.data.HP.text = this._combine(unit.HP, unit.basic.HP)
    this.data.MP.text = this._combine(unit.MP, unit.basic.MP)
    this.data.physicalStrength.text = this._combine(unit.physicalStrength, unit.basic.physicalStrength)
    this.data.physicalResistance.text = this._combine(unit.physicalResistance, unit.basic.physicalResistance)
    this.data.technique.text = this._combine(unit.technique, unit.basic.technique)
    this.data.agility.text = this._combine(unit.agility, unit.basic.agility)
    this.data.magicalStrength.text = this._combine(unit.magicalStrength, unit.basic.magicalStrength)
    this.data.magicalResistance.text = this._combine(unit.magicalResistance, unit.basic.magicalResistance)
    this.data.HPrecover.text = this._combine(unit.HPrecover, unit.basic.HPrecover)
    this.data.MPrecover.text = this._combine(unit.MPrecover, unit.basic.MPrecover)

    this.data.magicFire.text = "火\n" + STRING_MAP_MAGIC[unit.magic.fire]
    this.data.magicAqua.text = "水\n" + STRING_MAP_MAGIC[unit.magic.aqua]
    this.data.magicWind.text = "風\n" + STRING_MAP_MAGIC[unit.magic.wind]
    this.data.magicEarth.text = "土\n" + STRING_MAP_MAGIC[unit.magic.earth]
    this.data.magicLight.text = "光\n" + STRING_MAP_MAGIC[unit.magic.light]
    this.data.magicDark.text = "闇\n" + STRING_MAP_MAGIC[unit.magic.dark]

    this.data.attackTimes.text = "攻撃 × " + unit.attackTypes.reduce((a, x) => a + (x !== 0), 0)
    this.data.attackTypes.text = "（" + unit.attackTypes.reduce((a, x) => a + (x !== 0 ? STRING_MAP_ATTACK[x] + " " : ""), "") + "）"
    // this.data.uniqueSkil.text = ""

    this.data.moveType.text = "移動タイプ：" + STRING_MAP_MOVE[unit.moveType] + "タイプ"
    this.data.moveRange.text = "　　移動力：" + unit.base.moveRange

    const effect = ["", "弱い", "強い", "吸収"]
    this.data.resist.text = Object.keys(unit.resist).reduce((a, x) =>
      a + (unit.resist[x] === 0 ? "" : STRING_MAP_RESIST[x] + "攻撃に" + effect[parseInt(unit.resist[x])] + "\n"), "")

    this.footerContainer.y = this.footerContainer.offset + this.data.resist.getMeasuredHeight() + 5
    this.data.killStats.text = this._format3digits(unit.killStats)
    this.data.cost.text = unit.isMaster || unit.characterType.named > 0 ? this._format3digits(unit.cost) : this._format3digits(0)

    this.container.visible = true
  }

  setup() {
    let container = this.addChild(new createjs.Container())
    this.container = container
    container.visible = false

    let background = container.addChild(new createjs.Shape())
    background.graphics.beginFill("darkblue").drawRect(0, 0, SIDEBAR_CONTENT_WIDTH, 750)
    background.graphics.beginStroke("white").drawRect(5, 5, SIDEBAR_CONTENT_WIDTH - 10, 750)

    let subContainer = container.addChild(new createjs.Container())
    this.subContainer = subContainer

    let contentY = 0
    let name = subContainer.addChild(new createjs.Text("ファイアジャイアント", "15px arial", "white"))
    name.x = 45
    name.y = contentY += 8

    let species = subContainer.addChild(new createjs.Text("人間系", "14px arial", "white"))
    species.x = 50
    species.y = contentY += 20

    let named = subContainer.addChild(new createjs.Text("（人材）", "14px arial", "white"))
    named.x = 130
    named.y = contentY

    let rank = subContainer.addChild(new createjs.Text("Rank S", "14px arial", "white"))
    rank.x = 50
    rank.y = contentY += 15

    let experience = subContainer.addChild(new createjs.Text("Exp 100", "14px arial", "white"))
    experience.x = 120
    experience.y = contentY

    const contentX = 40
    const contentX2 = 105
    let lHP = subContainer.addChild(new createjs.Text("HP", "14px arial", "white"))
    let HP = subContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    lHP.x = contentX
    HP.x = contentX2
    lHP.y = HP.y = contentY += 20

    let lMP = subContainer.addChild(new createjs.Text("MP", "14px arial", "white"))
    let MP = subContainer.addChild(new createjs.Text(" 10/ 10", "14px Courier New", "white"))
    lMP.x = contentX
    MP.x = contentX2
    lMP.y = MP.y = contentY += 15

    let lphysicalStrength = subContainer.addChild(new createjs.Text("攻撃力", "14px arial", "white"))
    let physicalStrength = subContainer.addChild(new createjs.Text(" 10/ 10", "14px Courier New", "white"))
    lphysicalStrength.x = contentX
    physicalStrength.x = contentX2
    lphysicalStrength.y = physicalStrength.y = contentY += 15

    let lphysicalResistance = subContainer.addChild(new createjs.Text("防御力", "14px arial", "white"))
    let physicalResistance = subContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    lphysicalResistance.x = contentX
    physicalResistance.x = contentX2
    lphysicalResistance.y = physicalResistance.y = contentY += 15

    let ltechnique = subContainer.addChild(new createjs.Text("技量", "14px arial", "white"))
    let technique = subContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    ltechnique.x = contentX
    technique.x = contentX2
    ltechnique.y = technique.y = contentY += 15

    let lagility = subContainer.addChild(new createjs.Text("素早さ", "14px arial", "white"))
    let agility = subContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    lagility.x = contentX
    agility.x = contentX2
    lagility.y = agility.y = contentY += 15

    let lmagicalStrength = subContainer.addChild(new createjs.Text("魔力", "14px arial", "white"))
    let magicalStrength = subContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    lmagicalStrength.x = contentX
    magicalStrength.x = contentX2
    lmagicalStrength.y = magicalStrength.y = contentY += 15

    let lmagicalResistance = subContainer.addChild(new createjs.Text("抵抗力", "14px arial", "white"))
    let magicalResistance = subContainer.addChild(new createjs.Text("100/100", "14px Courier New", "white"))
    lmagicalResistance.x = contentX
    magicalResistance.x = contentX2
    lmagicalResistance.y = magicalResistance.y = contentY += 15

    let lMPrecover = subContainer.addChild(new createjs.Text("HP再生", "14px arial", "white"))
    let MPrecover = subContainer.addChild(new createjs.Text(" 10/ 10", "14px Courier New", "white"))
    lMPrecover.x = contentX
    MPrecover.x = contentX2
    lMPrecover.y = MPrecover.y = contentY += 15

    let lHPrecover = subContainer.addChild(new createjs.Text("MP再生", "14px arial", "white"))
    let HPrecover = subContainer.addChild(new createjs.Text(" 10/ 10", "14px Courier New", "white"))
    lHPrecover.x = contentX
    HPrecover.x = contentX2
    lHPrecover.y = HPrecover.y = contentY += 15

    const magicMargine = 22
    let magicFire = subContainer.addChild(new createjs.Text("火\nＳ", "14px arial", "white"))
    magicFire.x = 38
    magicFire.y = contentY += 25

    let magicAqua = subContainer.addChild(new createjs.Text("水\n✖", "14px arial", "white"))
    magicAqua.x = magicFire.x + magicMargine
    magicAqua.y = contentY

    let magicWind = subContainer.addChild(new createjs.Text("風\n✖", "14px arial", "white"))
    magicWind.x = magicAqua.x + magicMargine
    magicWind.y = contentY

    let magicEarth = subContainer.addChild(new createjs.Text("土\n✖", "14px arial", "white"))
    magicEarth.x = magicWind.x + magicMargine
    magicEarth.y = contentY

    let magicLight = subContainer.addChild(new createjs.Text("光\n✖", "14px arial", "white"))
    magicLight.x = magicEarth.x + magicMargine
    magicLight.y = contentY

    let magicDark = subContainer.addChild(new createjs.Text("闇\n✖", "14px arial", "white"))
    magicDark.x = magicLight.x + magicMargine
    magicDark.y = contentY

    let attackTimes = subContainer.addChild(new createjs.Text("攻撃 × 3", "14px arial", "white"))
    attackTimes.x = 30
    attackTimes.y = contentY += 45

    let attackTypes = subContainer.addChild(new createjs.Text("（通常 神聖 毒）", "14px arial", "white"))
    attackTypes.x = 20
    attackTypes.y = contentY += 15

    let uniqueSkil = subContainer.addChild(new createjs.Text("弓矢 × 3", "14px arial", "white"))
    uniqueSkil.x = 30
    uniqueSkil.y = contentY += 15

    let moveType = subContainer.addChild(new createjs.Text("移動タイプ：飛行タイプ", "14px arial", "white"))
    moveType.x = 25
    moveType.y = contentY += 30

    let moveRange = subContainer.addChild(new createjs.Text("　　移動力：10", "14px arial", "white"))
    moveRange.x = 25
    moveRange.y = contentY += 15

    let resist = subContainer.addChild(new createjs.Text("石化攻撃に強い\n即死攻撃に強い", "14px arial", "white"))
    resist.x = 50
    resist.y = contentY += 30

    // resistの長さが可変なのでfooterContainerの位置は調節される
    let footerContainer = subContainer.addChild(new createjs.Container())
    this.footerContainer = footerContainer
    footerContainer.offset = contentY
    footerContainer.y = contentY += resist.getMeasuredHeight() + 17
    contentY = 0

    let lkillStats = footerContainer.addChild(new createjs.Text("撃破数", "14px arial", "white"))
    let killStats = footerContainer.addChild(new createjs.Text("100", "14px Courier New", "white"))
    lkillStats.x = 45
    killStats.x = 125

    let lcost = footerContainer.addChild(new createjs.Text("人件費", "14px arial", "white"))
    let cost = footerContainer.addChild(new createjs.Text("  5", "14px Courier New", "white"))
    lcost.x = 45
    cost.x = 125
    lcost.y = cost.y = contentY += 15

    let button = footerContainer.addChild(new Button("閉じる", 100, 20))
    button.regX = button.getBounds().width / 4
    button.x = 100
    button.y = contentY += 40

    container.on("click", () => this.undisplay())
    button.on("click", () => this.undisplay())

    this.data = {
      name: name, species: species, named: named, rank: rank, experience: experience,
      HP: HP, MP: MP, physicalStrength: physicalStrength, physicalResistance: physicalResistance,
      technique: technique, agility: agility, magicalStrength: magicalStrength,
      magicalResistance: magicalResistance, HPrecover: HPrecover, MPrecover: MPrecover,
      magicFire: magicFire, magicAqua: magicAqua, magicWind: magicWind, magicEarth: magicEarth,
      magicLight: magicLight, magicDark: magicDark, attackTimes: attackTimes, attackTypes: attackTypes,
      uniqueSkil: uniqueSkil, moveType: moveType, moveRange: moveRange, resist: resist,
      killStats: killStats, cost: cost
    }
  }

  _combine(value1, value2) {
    return this._format3digits(value1) + "/" + this._format3digits(value2)
  }

  _format3digits(value) {
    return " ".repeat(-(value.toString().length - 3)) + value
  }
}