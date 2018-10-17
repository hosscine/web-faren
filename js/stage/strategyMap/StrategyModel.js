const STRATEGY_STATE = {
  default: 0,
  awaitEmployer: 10
}

class StrategyModel {
  constructor() {
    this.state = STRATEGY_STATE.default
  }

  employ() {
    this.resetState()
    if (!this.area.hasSpace) return alert("エリアに空きがありません")
    this.employerUnits = this.area.stayingUnits
    return this.state = STRATEGY_STATE.awaitEmployer
  }

  resetState() {
    this.state = STRATEGY_STATE.default
  }

  getUnitsImages(handler) {
    let [mainUnits, subUnits, mainImages, subImages] = []
    let [mainBadge, subBadge, mainColor, subColor] = ["end", "end", "white", "white"]

    switch (this.state) {
      case STRATEGY_STATE.awaitEmployer:
        [mainUnits, subUnits] = [this.employerUnits]
        mainColor = "limegreen"; break
      case STRATEGY_STATE.default:
        [mainUnits, subUnits] = [this.area.stayingUnits]
        if (!this.area.owner.isPlayer) mainBadge = null; break
    }

    if (mainUnits) mainImages = mainUnits.map(unit => unit.getUnitBitmap(handler, mainBadge))
    if (subUnits) subImages = subUnits.map(unit => unit.getUnitBitmap(handler, subBadge))
    return [mainImages, subImages, mainColor, subColor]
  }

  set areaCommand(value) { this.areaCommand = value }
  get areaCommand() { return this.areaCommand }
}