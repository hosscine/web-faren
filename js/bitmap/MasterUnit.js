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
    this.nameText.text = this.name
    this.isMaster = true
    assets.charadata.characters[this.id].isMaster = true
  }

  set FaceImage(alphaBitmap) {
    this.faceImage = alphaBitmap
  }

  get selectableFaceBitmap() {
    let container = new createjs.Container()
    let face = container.addChild(new createjs.Bitmap(this.faceImage.canvas))
    this.nameText = container.addChild(new createjs.Text(this.name, "8px arial", "white"))
    container.himself = this
    this.nameText.textAlign = "center"
    this.nameText.x = face.getBounds().width / 2
    this.nameText.y = face.getBounds().height
    return container
  }

  get flagBitmap() {
    if (this.flagImage === undefined)
      if (this.flagImageID === 0) Error(this.name + "に旗画像が設定されていませんが，読み込みを試みました")
      else Error(this.name + "の旗画像の読み込みに失敗しています")
    return new MotionBitmap(this.flagImage.canvas, FLAG_SIZE, FLAG_SIZE, FLAG_MOTION_INTERVAL)
  }

  initialEmploy(fund, nStaying, assets) {
    let candidates = []
    for (let id of this.employable) candidates.push(assets.charadata.characters[id])
    candidates.sort((a, b) => { return -(a.cost - b.cost) })

    let units = []
    let priority = 0
    while (priority <= candidates.length - 1)
      for (let i = priority; i <= priority + 2 && i <= candidates.length - 1; i++)
        if (fund - candidates[i].cost > 0 && nStaying + units.length < MAX_AREA_UNITS) {
          units.push(new Unit(candidates[i].id, assets))
          fund -= candidates[i].cost
        }
        else {
          priority += 1
          break
        }
        
    return units
  }
}
