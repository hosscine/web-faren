const STRATEGY_STATE = {
  default: 1,
  awaitEmployer: 11,
  awaitEmployee: 12,
  awaitUnemployee: 13,
  awaitWarTarget: 21,
  awaitAttackers: 22,
  awaitMoveTarget: 31,
  awaitMovers: 32,
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

  getAttackers() { // warの実行メソッド
    if (this.subBins.every(unit => unit === 0)) return alert("侵攻するユニットが一体もいません")
    let go = window.confirm(this.targetArea.name + "に侵攻します")
    if (!go) return

    let attackers = this.subBins.filter(unit => unit !== 0)
    this.resetState()
    return attackers
  }

  startMove() {
    this.resetState()
    this.subBins = Array(20).fill(0)
    return this.state = STRATEGY_STATE.awaitMoveTarget
  }

  setMoveTarget(area) {
    if (area === this.area) return alert("移動元と同じエリアです")
    else if (area.owner !== this.player) return alert("移動先は自軍のエリアを選択してください")
    if (this.targetArea) this.executeMove() // 移動先エリアを切り替える前に移動を確定

    this.targetArea = area
    this.mainBins = this.area.getStayingUnits20Bins()
    this.subBins = this.targetArea.getStayingUnits20Bins()
    return this.state = STRATEGY_STATE.awaitMovers
  }

  executeMove() {
    if (this.state !== STRATEGY_STATE.awaitMovers) return
    this.area.setStayingUnits20Bins(this.mainBins)
    this.targetArea.setStayingUnits20Bins(this.subBins)
    this.resetState()
  }

  makeBinsDic() {
    let binsDic = {}
    for (let area of this.area.adjacentAreas) binsDic[area.name] = area.getStayingUnits20Bins()
    binsDic[this.area.name] = this.area.getStayingUnits20Bins()
    return binsDic
  }

  getBothBins(mainArea) {
    let main = this.state === STRATEGY_STATE.awaitAttackers ?
      this.mainBinsDic[mainArea.name] : this.mainBins
    let sub = this.subBins
    return [main, sub]
  }

  allMoveUnit(fromIsMain) {
    let [main, sub] = this.getBothBins(this.area)
    if (fromIsMain) for (let unit of main) this.transferBins(unit, main, sub)
    else for (let unit of sub) this.transferBins(unit, sub, main)
  }

  moveUnit(unit) {
    let [main, sub] = this.getBothBins(unit.stayingArea)
    let fromIsMain = !this.subBins.includes(unit)
    if (fromIsMain) this.transferBins(unit, main, sub)
    else this.transferBins(unit, sub, main)
  }

  transferBins(unit, from, to) {
    if (!unit.active || unit === 0 || !to.includes(0)) return
    to[to.indexOf(0)] = unit
    from[from.indexOf(unit)] = 0
    unit.onMove = !unit.onMove
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

  startUnemploy() {
    this.resetState()
    return this.state = STRATEGY_STATE.awaitUnemployee
  }

  executeUnemploy(unit) {
    if (!unit.active) return alert("既に行動済みのユニットです")
    else if (unit.isMaster) return alert("マスターは解雇できません")

    let go = window.confirm("この部隊を解雇してよろしいですか？")
    if (go) this.area.unemployUnit(unit)
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
      mainUnits = this.employees;
      [mainBadge, mainColor] = ["cost", "limegreen"]
    }
    else if (this.state === STRATEGY_STATE.awaitUnemployee) {
      mainUnits = this.area.stayingUnits
      mainColor = "yellow"
    }
    else if (this.state === STRATEGY_STATE.awaitWarTarget) {
      [mainUnits, subUnits] = [this.mainBinsDic[this.area.name], this.subBins]
      subColor = "red"
    }
    else if (this.state === STRATEGY_STATE.awaitAttackers) {
      [mainUnits, subUnits] = [this.mainBinsDic[this.area.name], this.subBins];
      [mainBadge, subBadge, mainColor, subColor] = ["move", "move", "red", "red"]
    }
    else if (this.state === STRATEGY_STATE.awaitMoveTarget) {
      [mainUnits, subUnits] = [this.area.stayingUnits, this.subBins]
      subColor = "cyan"
    }
    else if (this.state === STRATEGY_STATE.awaitMovers) {
      [mainUnits, subUnits] = [this.mainBins, this.subBins];
      [mainBadge, subBadge, mainColor, subColor] = ["move", "move", "cyan", "cyan"]
    }

    if (mainUnits) mainImages = mainUnits.map(unit => unit === 0 ? 0 : unit.getUnitBitmap(handler, mainBadge))
    if (subUnits) subImages = subUnits.map(unit => unit === 0 ? 0 : unit.getUnitBitmap(handler, subBadge))
    return [mainImages, subImages, mainColor, subColor]
  }

  isInMainUnits(unit) {
    return this.state >= STRATEGY_STATE.awaitWarTarget ? !this.subBins.includes(unit) : true
  }

  set areaCommand(value) { this.area.command = value }
  get areaCommand() { return this.area.command }
}