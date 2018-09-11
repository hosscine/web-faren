class Unit {
  constructor(id, assets = null) {
    this.id = id
    if (assets !== null) this.setup(assets)
  }

  setup(assets) {
    let data = assets.charadata.characters[this.id - 1]
    for (let i in data) this[i] = data[i]
  }

  get faceBitmap() {
    if (this.faceImage === undefined)
      if (this.faceImageID === 0) Error(this.name + "に顔絵が設定されていませんが，読み込みを試みました")
      else Error(this.name + "の顔絵の読み込みに失敗しています")
    return new createjs.Bitmap(this.faceImage.canvas)
  }

}
