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
    this._fund = 0

    this.dominatingAreas = []
  }

  setup(assets) {
    this.id = assets.charadata.no2id(this.no)
    assets.charadata.characters[this.id].isMaster = true
    super.setup(assets)
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

  initialEmploy(fund, nStaying, assets, areaEmployable) {
    // 雇用費の降順に並べた初期雇用候補を作成
    let candidates = []
    if (this.isMaster) for (let id of this.employable) candidates.push(assets.charadata.characters[id])
    else for (let id of areaEmployable) candidates.push(assets.charadata.characters[id])
    candidates.sort((a, b) => { return -(a.cost - b.cost) })

    // while    任意の雇用候補が雇える間
    //   for    雇用候補の先頭3人を優先して雇う
    //     if   お金が足りていてエリアに空きがあれば雇う
    //     else ダメなら雇用候補の先頭2~4人を優先するようにする
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

  dominateArea(area) { this.dominatingAreas.push(area) }
  releaseArea(area) { this.dominatingAreas.splice(this.dominatingAreas.indexOf(area), 1) }
  get stayingArea() { for (let area of this.dominatingAreas) if (area.isStayingMaster) return area }

  activateFollowerUnits() {
    for (let area of this.dominatingAreas)
      for (let unit of area.stayingUnits)
        unit.active = true
  }

  get income() { return this.dominatingAreas.reduce((a, x) => a + x.income, 0) }
  get outgo() { return this.dominatingAreas.reduce((a, x) => a + x.outgo, 0) }
  get fund() { return this._fund }
  set fund(value) { this._fund = value }

  pay(value) {
    if (this.fund < value) return false
    this.fund -= value
    return true
  }
}
