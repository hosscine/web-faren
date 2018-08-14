class SelectCharacterStage extends createjs.Stage {
  constructor(canvas) {
    super(canvas)
  }

  setup(masters) {
    this.masters = masters

    this.addChild(masters[0].faceBitmap)
    for (let master in masters) {
      console.log(masters[master])
      let bmp = masters[master].faceBitmap
      bmp.scaleX = bmp.scaleY = 2
      this.addChild(bmp)
    }
  }

  set mastersEnable(bool) {
    let handleClick = () => {

    }

    let handleMouseover = () => {

    }

    for (let i in this.masters) {
      if (bool) this.masters[i].faceBitmap.on("click", handleClick)
      else this.masters[i].faceBitmap.off("click", handleClick)
    }
  }
}

window.SelectCharacterStage = createjs.promote(SelectCharacterStage, "Stage")
