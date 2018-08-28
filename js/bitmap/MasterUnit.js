class MasterUnit extends Unit {
  constructor(id, name, difficulty, explanation) {
    super(id, name)

    this.difficulty = difficulty
    this.explanation = explanation
  }

  setup(faceBitmap) {
    this.faceBitmap = new createjs.Container()
    this.faceBitmap.addChild(faceBitmap)
    let nameText = this.faceBitmap.addChild(new createjs.Text(this.name, "8px arial", "white"))
    nameText.regX = nameText.getMeasuredWidth() / 2
    nameText.x = faceBitmap.getBounds().width / 2 + 10
    nameText.y = faceBitmap.getBounds().height
  }

  setMasterFlag(flagBitmap) {
    this.flag = flagBitmap
  }

}
