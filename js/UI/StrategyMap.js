class StrategyMap extends ScrollContainer {
  constructor(mapBitmap, headerMargine) {
    super()

    this.mapBitmap = mapBitmap
    // this.headerMargine = headerMargine
    this.setup()
  }

  setup() {
    this.addChild(this.mapBitmap)

    this.contentWidth = this.mapBitmap.getBounds().width * this.scaleX
    this.contentHeight = this.mapBitmap.getBounds().height * this.scaleY
    console.log(this.mapBitmap.getBounds().height * this.scaleY)
  }

  setupAreaFlag(areas) {
    // 先にエリア間の接続を描画
    for (let i in areas) {
      let adjacency = areas[i].adjacency
      for (let j in adjacency) this.addChild(areas[i].getLineTo(areas[adjacency[j] - 1]))
    }
    // 次にエリアの旗と名前を描画
    for (let i in areas) {
      let areaname = new createjs.Text(areas[i].name)
      this.addChild(areas[i].ownerNameFlag)
    }
  }
}
