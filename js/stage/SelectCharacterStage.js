const faceMargine = 40

class SelectCharacterStage extends createjs.Stage {
  constructor(canvas) {
    super(canvas)
  }

  setup(masters) {
    this.masters = masters
    this.faceContainer = this.addChild(new ScrollContainer())
    this.explanationArea = this.addChild(new ExplanationArea())

    this.displayMasters()
    this.mastersEnable = true
  }

  displayMasters() {
    for (let i in this.masters) {
      let bmp = this.faceContainer.addChild(this.masters[i].faceBitmap)
      let id = parseInt(i)
      let row = id % 2
      let col = (id - id % 2)

      bmp.scaleX = bmp.scaleY = 2
      bmp.x = col / 2 * bmp.getChildAt(0).getBounds().width * bmp.scaleX +
        col * faceMargine + faceMargine
      bmp.y = row * bmp.getChildAt(0).getBounds().height * bmp.scaleY +
        faceMargine * row + bmp.getChildAt(1).getMeasuredHeight() * 2 * row
    }

    let ncols = parseInt(this.masters.length / 2) + this.masters.length % 2
    let faceWidth = this.masters[0].faceBitmap.getChildAt(0).getBounds().width *
      this.masters[0].faceBitmap.scaleX
    this.faceContainer.contentWidth = faceWidth * ncols + faceMargine * ncols * 2
  }

  set mastersEnable(bool) {
    let handleClick = (event, data) => {
      let go = window.confirm(data.master.name + "でゲームを開始します")
      if (go) {
        this.mastersEnable = false
        stage = new StrategyMapStage(this.canvas, this.masters, data.master)
        createjs.Ticker.addEventListener("tick", stage)
        stage.update()
      }
    }

    let handleMouseover = (event, data) => {
      this.explanationArea.displayMaster(data.master)
    }

    for (let i in this.masters) {
      if (bool) {
        this.masters[i].faceBitmap.on("click", handleClick, null, false, {
          master: this.masters[i]
        })
        this.masters[i].faceBitmap.on("mouseover", handleMouseover, null, false, {
          master: this.masters[i]
        })
      } else this.masters[i].faceBitmap.removeAllEventListeners()
    }

  }
}

window.SelectCharacterStage = createjs.promote(SelectCharacterStage, "Stage")
