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
  }

  handleScroll(left, top) {
    scroller.scrollTarget.x = -left
    scroller.scrollTarget.y = -top
  }

  set contentWidth(width) {
    contentWidth = width
    reflow()
  }
  get contentWidth() {
    return contentWidth
  }
  set contentHeight(height) {
    contentHeight = height
    reflow()
  }
  get contentHeight() {
    return contentWidth
  }

}
