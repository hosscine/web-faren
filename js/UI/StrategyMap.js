class StrategyMap extends ScrollContainer {
  constructor(mapBitmap, headerMargine) {
    super()

    this.mapBitmap = mapBitmap
    this.headerMargine = headerMargine
    this.setup()
  }

  setup() {
    this.addChild(this.mapBitmap)

    this.y = this.headerMargine
    this.contentWidth = this.mapBitmap.getBounds().width * this.scaleX
    this.contentHeight = this.mapBitmap.getBounds().height * this.scaleY
    // this.contentHeight = this.mapBitmap.getBounds().height * this.scaleY - this.headerMargine
  }

  setupAreaFlag(areas) {
    for (let i in areas) {
      let adjacency = areas[i].adjacency
      for (let j in adjacency) this.addChild(areas[i].getLineTo(areas[adjacency[j] - 1]))
    }
    for (let i in areas) this.addChild(areas[i].ownerFlag)
  }
}
