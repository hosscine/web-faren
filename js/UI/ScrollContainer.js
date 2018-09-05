class ScrollContainer extends createjs.Container {
  constructor() {
    super()

    this.setupScroll()
  }

  setupScroll() {
    if(scroller === undefined) Error("scroller is undefined")
    else {
      scroller.scrollTarget = this
      scroller.__callback = this.handleScroll
    }
  }

  handleScroll(left, top){
    scroller.scrollTarget.x = -left
    scroller.scrollTarget.y = -top
  }

  set contentWidth(width){
    contentWidth = width + SIDEBAR_WIDTH
    reflow()
  }
  set contentHeight(height){
    contentHeight = height - clientHeight * 0.1
    reflow()
  }

}
