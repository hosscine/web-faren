class StrategyMap extends ScrollContainer {
  constructor(mapBitmap) {
    super()

    this.mapBitmap = mapBitmap
    this.setup()
  }

  setup() {
    this.addChild(this.mapBitmap)
    let bounds = this.mapBitmap.getBounds()
    this.setContentBounds(bounds.width, bounds.height)

    // マップ全体をキャッシュ
    this.cache(this.x, this.y, bounds.width, bounds.height)
    createjs.Tween.get(this, { loop: -1 })
      .wait(FLAG_MOTION_INTERVAL)
      .call(() => this.updateCache())
  }

  setupAreaFlag(areas) {
    this.removeAllChildren()
    this.addChild(this.mapBitmap)

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

  reflow(viewWidth, viewHeight) {
    let mapHeight = this.mapBitmap.getBounds().height
    if (mapHeight < viewHeight) this.setScale(viewHeight / mapHeight)
    else this.setScale(1)
  }
}
