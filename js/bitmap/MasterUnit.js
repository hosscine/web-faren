class MasterUnit extends Unit {
  constructor(id, name, difficulty, explanation) {
    super(id, name)

    this.difficulty = difficulty
    this.explanation = explanation
  }

  setup(faceBitmap) {
    this.faceBitmap = new createjs.Container()
    this.faceBitmap.addChild(faceBitmap)
    let nameText = this.faceBitmap.addChild(new createjs.Text(this.name, "5px arial", "white"))
    // nameText.regX = nameText.getMeasuredWidth() / 2
    // nameText.y = -2
    nameText.x = nameText.getMeasuredWidth() / 2

    // this.unitBitmap = unitBitmap
  }

}
