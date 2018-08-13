class SelectCharacterStage: extends createjs.Stage {
  constructor(canvas, masters) {
    super(canvas)

    this.masters = masters
  }

  setup(){
    for (let master in this.masters) this.addChild(master.faceBitmap)
  }
}

window.SelectCharacterStage = createjs.promote(SelectCharacterStage, "Stage")
