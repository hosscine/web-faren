class MasterUnit extends Unit {
  constructor(id, name, difficulty, explanation) {
    super(id)

    this.name = name
    this.difficulty = difficulty
    this.explanation = explanation
  }

  setupFaceImage(imageOrUri) {
    this.faceData = new AlphalizeBitmap(imageOrUri)

    this.faceBitmap = new createjs.Container()
    let face = this.faceBitmap.addChild(new createjs.Bitmap(this.faceData.canvas))
    let nameText = this.faceBitmap.addChild(new createjs.Text(this.name, "8px arial", "white"))
    nameText.regX = nameText.getMeasuredWidth() / 2
    nameText.x = face.getBounds().width / 2 + 10
    nameText.y = face.getBounds().height
  }

  setMasterFlag(flagBitmap) {
    this.flag = flagBitmap
  }

}
