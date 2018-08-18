class ScrollContainer extends createjs.Container {
  constructor() {
    super()

    this.setup()
  }

  setup() {
    if(scroller === undefined) Error("scroller is undefined")
    else {
      scroller.scrollTarget = this
      scroller.__callback = function(left, top){
        scroller.scrollTarget.x = -left
        scroller.scrollTarget.y = -top
      }
    }
  }

}
