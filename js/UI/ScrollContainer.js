class ScrollContainer extends createjs.Container {
  constructor() {
    super()

    this.setupScroll()
  }

  setupScroll() {
    if (scroller === undefined) Error("scroller is undefined")
    else {
      scroller.scrollTarget = this
      scroller.__callback = this.handleScroll
    }
    this.contentWidth = 0
    this.contentHeight = 0
  }

  handleScroll(left, top, zoom) {
    scroller.scrollTarget.x = -left
    scroller.scrollTarget.y = -top
    scroller.scrollTarget.scaleX = zoom
    scroller.scrollTarget.scaleY = zoom
  }

  setContentBounds(width, height) {
    this.contentWidth = width * this.scaleX
    this.contentHeight = height * this.scaleY
    this.exportContentSize()
  }

  setScale(value) {
    this.scaleX = this.scaleY = value
    this.exportContentSize()
  }

  exportContentSize() {
    contentWidth = this.contentWidth * this.scaleX
    contentHeight = this.contentHeight * this.scaleY
    this.updateScroll()
  }
  
  updateScroll() {
    let clientWidth = mainCanvas.clientWidth
    let clientHeight = mainCanvas.clientHeight
    scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight)
  }
}
