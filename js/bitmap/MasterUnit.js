const FLAG_SIZE = 32
const FLAG_MOTION_INTERVAL = 1000
const FLAG_ROOT_X = 7
const FLAG_ROOT_Y = 30

class MasterUnit extends Unit {
  constructor(no, name, difficulty, explanation) {
    super(no)
    this.no = no

    this.longName = name
    this.name = name
    this.difficulty = difficulty
    this.explanation = explanation
  }

  setup(assets) {
    this.id = assets.charadata.no2id(this.no)
    super.setup(assets)
    this.isMaster = true
    assets.charadata.characters[this.id].isMaster = true
  }

  set FaceImage(alphaBitmap) {
    this.faceImage = alphaBitmap
  }

  get selectableFaceBitmap() {
    let container = new createjs.Container()
    let face = container.addChild(new createjs.Bitmap(this.faceImage.canvas))
    let nameText = container.addChild(new createjs.Text(this.name, "8px arial", "white"))
    container.himself = this
    nameText.textAlign = "center"
    nameText.x = face.getBounds().width / 2
    nameText.y = face.getBounds().height
    return container
  }

  get flagBitmap() {
    if (this.flagImage === undefined)
      if (this.flagImageID === 0) Error(this.name + "に旗画像が設定されていませんが，読み込みを試みました")
      else Error(this.name + "の旗画像の読み込みに失敗しています")
    return new MotionBitmap(this.flagImage.canvas, FLAG_SIZE, FLAG_SIZE, FLAG_MOTION_INTERVAL)
  }

  initialEmployment() {

  }
}
