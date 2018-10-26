const STRATEGY_STATE = {
  default: 1,
  awaitEmployer: 11,
  awaitEmployee: 12
}

class StrategyModel {
  constructor(playerMaster, assets) {
    this.player = playerMaster
    this.assets = assets
    this.state = STRATEGY_STATE.default
  }

  startEmploy() {
    this.resetState()
    if (!this.area.hasSpace) return alert("エリアに空きがありません")
    this.employerUnits = this.area.stayingUnits
    return this.state = STRATEGY_STATE.awaitEmployer
  }

  setEmployer(unit) {
    if (!unit.active) return alert("既に行動済みのユニットです")
    else if (!unit.isFamily(this.player)) return alert("マスターと同種族でないユニットは雇用に従事できません")

    let employerCandidates = unit.employable.concat()
    let localCandidates = this.area.employable.concat()
    for (let i in employerCandidates) employerCandidates[i] = new Unit(employerCandidates[i], this.assets)
    for (let i in localCandidates) localCandidates[i] = new Unit(localCandidates[i], this.assets)
    employerCandidates.sort((a, b) => -(a.cost - b.cost))
    localCandidates.sort((a, b) => -(a.cost - b.cost))
    this.employees = employerCandidates.concat(localCandidates)
    this.employer = unit
    return this.state = STRATEGY_STATE.awaitEmployee
  }

  executeEmploy(unit) {
    if (this.player.pay(unit.cost)) {
      unit.moveToArea(this.area)
      this.area.sortStayingUnits()
      unit.active = this.employer.active = false
    }
    else alert("ユニットの雇用費を払えません")

    if (this.area.hasSpace) return this.startEmploy()
    return this.resetState()
  }

  resetState() {
    return this.state = STRATEGY_STATE.default
  }

  getUnitsImages(handler) {
    let [mainUnits, subUnits, mainImages, subImages] = []
    let [mainBadge, subBadge, mainColor, subColor] = ["end", "end", "white", "white"]

    if (this.state === STRATEGY_STATE.default) {
      mainUnits = this.area.stayingUnits
      if (!this.area.owner.isPlayer) mainBadge = null
    }
    else if (this.state === STRATEGY_STATE.awaitEmployer) {
      mainUnits = this.employerUnits
      mainColor = "limegreen"
    }
    else if (this.state === STRATEGY_STATE.awaitEmployee) {
      [mainBadge, mainColor] = ["cost", "limegreen"]
      mainUnits = this.employees
    }
    else if (this.state === STRATEGY_STATE.awaitEmployer) {

    }

    if (mainUnits) mainImages = mainUnits.map(unit => unit.getUnitBitmap(handler, mainBadge))
    if (subUnits) subImages = subUnits.map(unit => unit.getUnitBitmap(handler, subBadge))
    return [mainImages, subImages, mainColor, subColor]
  }

  isInMainUnits(unit) { return this.area.stayingUnits.includes(unit) }

  set areaCommand(value) { this.areaCommand = value }
  get areaCommand() { return this.areaCommand }
}