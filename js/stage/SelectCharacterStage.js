class SelectCharacterStage extends createjs.Stage {
  constructor(canvas, masters) {
    super(canvas)

    this.masters = masters
  }

  setup() {
    console.log("hoge")
    for (let master in this.masters) {
      console.log(this)
      this.addChild(master.faceBitmap)
    }
  }
}

window.SelectCharacterStage = createjs.promote(SelectCharacterStage, "Stage")
