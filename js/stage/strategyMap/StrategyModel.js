const STRATEGY_STATE = {
  default: 1,
  awaitEmployer: 11,
  awaitEmployee: 12,
  awaitWarTarget: 21,
  awaitAttackers: 22,
}

class StrategyModel {
  constructor(playerMaster, assets) {
    this.player = playerMaster
    this.assets = assets
    this.state = STRATEGY_STATE.default
  }

  startWar() {
    this.resetState()
    if (this.area.owner !== this.player) return alert("先に侵攻元の自軍のエリアを選択してください")
    this.mainBinsDic = this.makeBinsDic()
    this.subBins = Array(20).fill(0)
    this.state = STRATEGY_STATE.awaitWarTarget
  }

  setWarTarget(area) {
    if (area.owner !== this.player && !this.area.isAdjacent(area))
      return alert("対象のエリアは侵攻元のエリアと隣接していません")

    // 自軍のエリアが選択されたら 侵攻元のエリアを再設定
    if (area.owner === this.player) {
      if (this.targetArea) if (!this.targetArea.isAdjacent(area))
        return alert("対象のエリアは侵攻先のエリアと隣接していません")
      this.area = area
      return area
    }

    // 敵軍のエリアが選択されたら 侵攻先のエリアを設定
    this.targetArea = area
    this.state = STRATEGY_STATE.awaitAttackers
  }

  getAttackers() {
    if (this.subBins.every(unit => unit === 0)) return alert("侵攻するユニットが一体もいません")
    let go = window.confirm(this.targetArea.name + "に侵攻します")
    if (!go) return

    let attackers = this.subBins.filter(unit => unit !== 0)
    this.resetState()
    return attackers
  }

  makeBinsDic() {
    let binsDic = {}
    for (let area of this.area.adjacentAreas) binsDic[area.name] = area.getStayingUnits20Bins()
    binsDic[this.area.name] = this.area.getStayingUnits20Bins()
    return binsDic
  }

  getUnitBins(unit) {
    if (this.subBins.includes(unit)) return unit
    for (let bins in Object.value(this.binsDic)) if (bins.includes(unit)) return bins
    Error("unit not found in bins")
  }

  allMoveTo(moveto) {
    if (this.state === STRATEGY_STATE.awaitAttackers) {
      let units = moveto === "toMain" ? this.subBins : this.mainBinsDic[this.area.name]
      for (let unit of units) if (unit !== 0) if (!this.moveBins2Bins(unit)) return
    }
    else if (this.state === STRATEGY_STATE.awaitMovers) {
      let units = moveto === "toMain" ? this.subBins : this.mainBins
    }
  }

  moveBins2Bins(unit) {
    if (!unit.active) return

    let isInMain = !this.subBins.includes(unit)
    let areaName = unit.stayingArea.name
    let from = isInMain ? this.mainBinsDic[areaName] : this.subBins
    let to = isInMain ? this.subBins : this.mainBinsDic[areaName]

    if (!to.includes(0)) return

    to[to.indexOf(0)] = unit
    from[from.indexOf(unit)] = 0
    unit.onMove = !unit.onMove
    return this.state = STRATEGY_STATE.awaitAttackers
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
    if (this.subBins) for (let unit of this.subBins) if (unit !== 0) unit.onMove = false
    if (this.mainBins) for (let unit of this.mainBins) if (unit !== 0) unit.onMove = false
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
    else if (this.state === STRATEGY_STATE.awaitWarTarget) {
      [mainUnits, subUnits] = [this.mainBinsDic[this.area.name], this.subBins]
      subColor = "red"
    }
    else if (this.state === STRATEGY_STATE.awaitAttackers) {
      [mainUnits, subUnits] = [this.mainBinsDic[this.area.name], this.subBins];
      [mainBadge, subBadge, mainColor] = ["move", "move", "red"]
    }

    if (mainUnits) mainImages = mainUnits.map(unit => unit === 0 ? 0 : unit.getUnitBitmap(handler, mainBadge))
    if (subUnits) subImages = subUnits.map(unit => unit === 0 ? 0 : unit.getUnitBitmap(handler, subBadge))
    return [mainImages, subImages, mainColor, subColor]
  }

  isInMainUnits(unit) { return this.area.stayingUnits.includes(unit) }

  set areaCommand(value) { this.area.command = value }
  get areaCommand() { return this.area.command }
}