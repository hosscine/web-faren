class SelectCharacterStage extends createjs.Stage {
  constructor(canvas) {
    super(canvas)
  }

  setup(masters) {
    this.masters = masters

    this.addChild(masters[0].faceBitmap)
    for (let master in masters) {
      this.addChild(master.faceBitmap)
    }
  }
}

window.SelectCharacterStage = createjs.promote(SelectCharacterStage, "Stage")
