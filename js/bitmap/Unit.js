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
  }

  get faceBitmap() {
    if (this.faceImage === undefined)
      if (this.faceImageID === 0) Error(this.name + "に顔絵が設定されていませんが，読み込みを試みました")
      else Error(this.name + "の顔絵の読み込みに失敗しています")
    return new createjs.Bitmap(this.faceImage.canvas)
  }

  // 戦力指数のこと
  get competence() {
    return Math.floor((this.experience + 20) * 1.6 ** this.rank)
  }

}
