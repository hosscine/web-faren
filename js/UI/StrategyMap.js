class StrategyMap extends ScrollContainer {
  constructor(mapBitmap) {
    super()

    this.mapBitmap = mapBitmap
    this.setup()
  }

  setup() {
    this.addChild(this.mapBitmap)

    let width = this.mapBitmap.getBounds().width
    let height = this.mapBitmap.getBounds().height

    this.contentWidth = width * this.scaleX
    this.contentHeight = height * this.scaleY

    // マップ全体をキャッシュ
    this.cache(this.x, this.y, width, height)
    createjs.Tween.get(this, { loop: -1 })
      .wait(FLAG_MOTION_INTERVAL)
      .call(() => this.updateCache())
  }

  setupAreaFlag(areas) {
    // 先にエリア間の接続を描画
    for (let i in areas) {
      let adjacency = areas[i].adjacency
      for (let j in adjacency) this.addChild(areas[i].getLineTo(areas[adjacency[j] - 1]))
    }
    // 次にエリアの旗と名前を描画
    for (let i in areas) {
      this.addChild(areas[i].ownerNameFlag)
    }
    this.updateCache()
  }
}
