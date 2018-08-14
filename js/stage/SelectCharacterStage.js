const faceMargine = 40

class SelectCharacterStage extends createjs.Stage {
  constructor(canvas) {
    super(canvas)
  }

  setup(masters) {
    this.masters = masters
    this.faceArea = this.addChild(new createjs.Container())
    this.explanationArea = this.addChild(new ExplanationArea())

    this.displayMasters()
  }

  displayMasters() {
    for (let i in this.masters) {
      let bmp = this.faceArea.addChild(this.masters[i].faceBitmap)
      let id = parseInt(i)
      let row = id % 2
      let col = (id - id % 2)

      bmp.scaleX = bmp.scaleY = 2
      bmp.x = col / 2 * bmp.getChildAt(0).getBounds().width * bmp.scaleX +
        col * faceMargine + faceMargine
      bmp.y = row * bmp.getChildAt(0).getBounds().height * bmp.scaleY +
        faceMargine * row + bmp.getChildAt(1).getMeasuredHeight() * 2 * row
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
