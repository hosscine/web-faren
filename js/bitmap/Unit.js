const STRING_MAP_SPECIES = ["人間系", "リザードマン", "ゴブリン", "エルフ", "ドワーフ", "悪魔", "アイスマン", "モンスター"]
const STRING_MAP_RANK = ["E", "D", "C", "B", "A", "S"]
const STRING_MAP_MAGIC = ["✖", "Ｄ", "Ｃ", "Ｂ", "Ａ", "Ｓ"]
const STRING_MAP_ATTACK = ["", "通常", "毒", "石化", "麻痺", "眠り", "幻想", "即死", "吸収", "神聖"]
const STRING_MAP_MOVE = ["草原", "鈍足", "海上", "砂漠", "沼地", "山地", "森林", "雪原", "騎馬", "飛行"]
const STRING_MAP_RESIST = {
  physical: "通常", poison: "毒", stone: "石化", paralyze: "麻痺", sleep: "眠り", illusion: "幻想", death: "即死",
  absorb: "吸収", holy: "神聖", fire: "火魔法", aqua: "水魔法", wind: "風魔法", earth: "土魔法", light: "光魔法", dark: "闇魔法"
}

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
    this.active = false
    this.buff = {}
    this.basic = {}
    this.resetBuff()
    this.calculateBasicStatus()
  }

  // ランクによって変動するステータスに修正をかける
  calculateBasicStatus() {
    for (let key in this.base) this.basic[key] = this.base[key] * 1.08 ** this.rank
  }

  resetBuff() {
    for (let key in this.base) this.buff[key] = 1
    this.buff.nattack = 1
  }

  get faceBitmap() {
    if (this.faceImage === undefined)
      if (this.faceImageID === 0) Error(this.name + "に顔絵が設定されていませんが，読み込みを試みました")
      else Error(this.name + "の顔絵の読み込みに失敗しています")
    return new createjs.Bitmap(this.faceImage.canvas)
  }

  getUnitBitmap(displayer, callbacks, badge) {
    this.displayer = displayer
    let bitmap = new createjs.Bitmap(this.unitImage.canvas)
    for (let key in callbacks) bitmap.on(key, () => this.sendCallback(callbacks[key]))

    let badgeText
    if (badge === "end" && !this.active) badgeText = new OutlineText("End")
    else if (badge === "cost") badgeText = new OutlineText(this.cost)
    else if (badge === "red" || badge === "blue") badgeText = new createjs.Text("♦", "15px arial", badge)
    if ((badge === "end" && !this.active) || badge === "cost") {
      badgeText.textAlign = "right"
      badgeText.x = 32
      badgeText.y = 20
    }

    let container = new createjs.Container()
    container.addChild(bitmap, badgeText)
    return container
  }

  sendCallback(methodName) {
    this.displayer[methodName](this)
  }

  get strSpecies() { return STRING_MAP_SPECIES[this.species] }
  get strRank() { return STRING_MAP_RANK[this.rank] }

  get HP() { return this.basic.HP * this.buff.HP }
  get MP() { return this.basic.MP * this.buff.MP }
  get physicalStrength() { return this.basic.physicalStrength * this.buff.physicalStrength }
  get physicalResistance() { return this.basic.physicalResistance * this.buff.physicalResistance }
  get technique() { return this.basic.technique * this.buff.technique }
  get agility() { return this.basic.agility * this.buff.agility }
  get magicalStrength() { return this.basic.magicalStrength * this.buff.magicalStrength }
  get magicalResistance() { return this.basic.magicalResistance * this.buff.magicalResistance }

  get attackPowers() {
    let d = this.howToAttack
    return [d.power1st, d.power2nd, d.power3rd, d.power4th, d.power5th]
  }
  get attackTypes() {
    let d = this.howToAttack
    return [d.type1st, d.type2nd, d.type3rd, d.type4th, d.type5th]
  }
  get moveType() { return this.buff.moveType === 1 ? this.base.moveType : STRING_MAP_MOVE.indexOf("飛行") }

  get killStats() { return 0 }
  get competence() { return Math.floor((this.experience + 20) * 1.6 ** this.rank) } // 戦力指数のこと
  get salary() { return this.characterType.named === 1 ? this.cost : 0 }
}
