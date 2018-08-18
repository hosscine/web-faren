class StrategyMap extends ScrollContainer {
  constructor(mapBitmap) {
    super()

    this.mapBitmap = mapBitmap
    this.setup()
  }

  setup() {
    this.addChild(this.mapBitmap)

    this.contentWidth = this.mapBitmap.getBounds().width * this.scaleX
    this.contentHeight = this.mapBitmap.getBounds().height * this.scaleY
  }
}
