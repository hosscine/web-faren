class Unit {
  constructor(id, assets = null) {
    this.id = id
    if (assets !== null) this.setup(assets)
  }

  setup(assets) {
    let data = assets.charadata.characters[this.id]
    for (let i in data) this[i] = data[i]

    this.rank = 0
    this.earnedExperience = 0
    this.buff = {}
    this.basic = {}
    this.resetBuff()
    this.calculateBasicStatus()    
  }

  calculateBasicStatus() {
    for (let key in this.standard) this.basic[key] = this.standard[key] * 1.08 ** this.rank
  }

  resetBuff() {
    for (let key in this.standard) this.buff[key] = 1
  }

  get faceBitmap() {
    if (this.faceImage === undefined)
      if (this.faceImageID === 0) Error(this.name + "に顔絵が設定されていませんが，読み込みを試みました")
      else Error(this.name + "の顔絵の読み込みに失敗しています")
    return new createjs.Bitmap(this.faceImage.canvas)
  }

  getUnitBitmap(displayer) {
    this.displayer = displayer
    let bitmap = new createjs.Bitmap(this.unitImage.canvas)
    bitmap.on("click", () => this.handleClick())
    bitmap.on("mouseover", () => this.handleMouseover())
    return bitmap
  }

  handleClick() {
    this.displayer.displayUnitDetail(this)
  }

  handleMouseover() {
    this.displayer.displayUnitOverview(this)
  }

  get HP() {
    return this.basic.HP * this.buff.HP
  }

  get MP() {
    return this.basic.MP * this.buff.MP
  }

  get physicalStrength() {
    return this.basic.physicalStrength * this.buff.physicalStrength
  }

  get physicalResistance() {
    return this.basic.physicalResistance * this.buff.physicalResistance
  }

  get technique() {
    return this.basic.technique * this.buff.technique
  }

  get agility() {
    return this.basic.agility * this.buff.agility
  }

  get magicalStrength() {
    return this.basic.magicalStrength * this.buff.magicalStrength
  }

  get magicalResistance() {
    return this.basic.magicalResistance * this.buff.magicalResistance
  }

  // 戦力指数のこと
  get competence() {
    return Math.floor((this.experience + 20) * 1.6 ** this.rank)
  }

}
