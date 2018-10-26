class StrategyVModelStage extends createjs.Stage {
  constructor(canvas, playerMaster, mainStage, assets) {
    super(canvas)
    this.player = playerMaster
    this.mainStage = mainStage
    this.assets = assets
    this.model = new StrategyModel(playerMaster, assets)
    this.view = new StrategyView(this, playerMaster)
    this.enableMouseOver(5)
    this.addChild(this.view)
  }

  handleUnitClick(unit) {
    switch (this.model.state) {
      case STRATEGY_STATE.awaitEmployer:
        this.model.setEmployer(unit); break
      case STRATEGY_STATE.awaitEmployee:
        this.model.executeEmploy(unit); break
      case STRATEGY_STATE.default:
        this.view.displayUnitDetail(unit); break
    }
    this.displayUnits()
    this.view.displayMaster(this.player)
  }

  handleUnitMouseover(unit) {
    let isAbove = this.model.isInMainUnits(unit)
    if (isAbove) this.view.unitOverview.y = 600
    this.view.displayUnitOverview(unit)
  }
  
  handleUnitMouseout(unit) {
    this.view.undisplayUnitOverview(unit)
  }

  handleAreaClick(area) {
    this.model.area = area
    this.view.displayArea(area)
    this.view.selectAreaCommand(area.command)
    this.view.commandsVisible = area.owner === this.player
    this.displayUnits()
  }

  handleWar() {

  }

  handleTurnEnd() {
    this.model.resetState()
    this.mainStage.nextMasterTurn(this.player)
  }

  handleAreaCommand(command) {
    this.model.areaCommand = command
    this.view.selectAreaCommand(this.model.areaCommand)
  }

  handleAllMove(moveto) {

  }

  handleMoveSubmit() {

  }

  handleMove() {

  }

  handleEmploy() {
    if (!this.model.startEmploy()) return
    this.displayUnits()
  }
  
  handleUnemploy() {

  }

  handleReset() {
    this.model.resetState()
    this.displayUnits()
  }

  displayUnits() {
    let [stayingBitmap, destinationBitmap, stayingColor, destinationColor] = this.model.getUnitsImages(this)
    if (stayingBitmap) this.view.displayUnitBitmaps(stayingBitmap, stayingColor)
    if (destinationBitmap) this.view.displayUnitBitmaps(destinationBitmap, destinationColor, "destination")
  }

  initializeBinsSet() {
    this.binsSet = {}
    for (let area of this.displayingArea.adjacentAreas) this.binsSet[area.name] = area.getStayingUnits20Bins()
    this.binsSet[this.displayingArea.name] = this.displayingArea.getStayingUnits20Bins()
  }

  switchWarMode() {
    this.resetMode()
    if (this.displayingArea.owner !== this.player) return alert("先に侵攻元の自軍のエリアを選択してください")
    this.initializeBinsSet()
    this.moveToUnits = Array(20).fill(0)

    this.displayUnitsBoth({
      unitClick: "displayUnitDetail", areaClick: "displayWarTarget", unitsFrom: this.binsSet[this.displayingArea.name],
      colorFrom: "white", badgeFrom: "end", unitsTo: this.moveToUnits, colorTo: "red"
    })
  }

  displayWarTarget(area) {
    if (area.owner !== this.player && !this.displayingArea.isAdjacent(area))
      return alert("対象のエリアは侵攻元のエリアと隣接していません")

    if (area.owner === this.player) { // 侵攻元のエリアを再設定
      if (this.warTargetArea) if (!this.warTargetArea.isAdjacent(area))
        return alert("対象のエリアは侵攻先のエリアと隣接していません")
      this.displayArea(area)
    }
    else { // 侵攻先のエリアを設定
      this.switchWarMode()
      this.warTargetArea = area
    }

    if (this.warTargetArea) {
      this.moveCommandsContainer.visible = true
      this.displayUnitsBoth({
        unitClick: "commandUnitAdvancement", areaClick: "displayWarTarget",
        unitsFrom: this.binsSet[this.displayingArea.name], colorFrom: "red", badgeFrom: "end", unitsTo: this.moveToUnits
      })
    }
    else this.switchWarMode()
  }

  commandUnitAdvancement(unit) {
    this.commandUnitMove(unit, true)
  }

  commandWarfare() {
    if (this.moveToUnits.every(unit => unit === 0)) return alert("侵攻するユニットが一体もいません")
    let go = window.confirm(this.warTargetArea.name + "に侵攻します")
    if (!go) return

    this.moveToUnits = this.moveToUnits.filter(unit => unit !== 0)
    this.mainStage.gotoBattleMap(this.warTargetArea, this.player, this.moveToUnits)
    this.resetMode()
  }

  switchMoveMode() {
    this.resetMode()
    this.displayUnitsBoth({
      unitClick: "displayUnitDetail", areaClick: "displayMoveCandidates", unitsFrom: this.displayingArea.stayingUnits,
      colorFrom: "white", badgeFrom: "end", unitsTo: null, colorTo: "cyan"
    })
  }

  displayMoveCandidates(area) {
    if (this.destinationArea) this.commandMoveSubmit() // 移動先エリアを切り替える前に移動を確定
    if (area === this.displayingArea) return alert("移動元と同じエリアです")
    else if (area.owner !== this.player) return alert("移動先は自軍のエリアを選択してください")

    this.destinationArea = area
    this.moveCommandsContainer.visible = true
    this.moveFromUnits = this.displayingArea.getStayingUnits20Bins()
    this.moveToUnits = this.destinationArea.getStayingUnits20Bins()

    this.displayUnitsBoth({
      unitClick: "commandUnitMove", areaClick: "displayMoveCandidates", unitsFrom: this.moveFromUnits,
      colorFrom: "cyan", badgeFrom: "end", unitsTo: this.moveToUnits
    })
  }

  commandUnitMove(unit, isWar = false) {
    if (!unit.active) return true
    let [from, to] = [,]
    if (this.moveToUnits.includes(unit)) {
      from = this.moveToUnits
      if (isWar) to = this.displayingArea.stayingUnits.includes(unit) ?
        this.binsSet[this.displayingArea.name] : this.binsSet[unit.stayingArea.name]
      else to = this.moveFromUnits
    }
    else {
      from = isWar ? this.binsSet[this.displayingArea.name] : this.moveFromUnits
      to = this.moveToUnits
    }

    if (to.includes(0)) {
      to[to.indexOf(0)] = unit
      from[from.indexOf(unit)] = 0
      unit.onMove = !unit.onMove

      let option = isWar ? { color: "red", badge: "end" } : { color: "cyan", badge: "move" }
      this.displayUnitsBoth({
        unitClick: isWar ? "commandUnitAdvancement" : "commandUnitMove",
        areaClick: isWar ? "displayWarTarget" : "displayMoveCandidates",
        unitsFrom: isWar ? this.binsSet[this.displayingArea.name] : this.moveFromUnits,
        colorFrom: option.color, badgeFrom: option.badge, unitsTo: this.moveToUnits
      })
      return false
    }
    return true
  }

  commandAllMoveTo(destination) {
    for (let unit of destination) if (unit.active) if (this.commandUnitMove(unit, this.warTargetArea)) break
  }

  commandMoveSubmit() {
    this.displayingArea.setStayingUnits20Bins(this.moveFromUnits)
    this.destinationArea.setStayingUnits20Bins(this.moveToUnits)
    this.resetMode()
  }

  switchEmployMode() {
    this.resetMode()
    if (!this.displayingArea.hasSpace) return alert("エリアに空きがありません")
    this.unitCallbacks.click = "displayEmployCandidates"
    this.displayUnits(this.displayingArea.stayingUnits, this.unitCallbacks, "limegreen")
  }

  displayEmployCandidates(unit) {
    if (!unit.active) return alert("既に行動済みのユニットです")
    else if (!unit.isFamily(this.player)) return alert("マスターと同種族でないユニットは雇用に従事できません")

    let candidates1 = unit.employable.concat()
    let candidates2 = this.displayingArea.employable.concat()
    for (let i in candidates1) candidates1[i] = new Unit(candidates1[i], this.assets)
    for (let i in candidates2) candidates2[i] = new Unit(candidates2[i], this.assets)
    candidates1.sort((a, b) => -(a.cost - b.cost))
    candidates2.sort((a, b) => -(a.cost - b.cost))
    let candidates = candidates1.concat(candidates2)

    this.commandingUnit = unit
    this.unitCallbacks.click = "commandEmployUnit"
    this.displayUnits(candidates, this.unitCallbacks, "limegreen", "cost")
  }

  commandEmployUnit(unit) {
    if (this.player.pay(unit.cost)) {
      unit.moveToArea(this.displayingArea)
      this.displayingArea.sortStayingUnits()
      this.displayMaster(this.player)
      unit.active = this.commandingUnit.active = false
    }
    else alert("ユニットの雇用費を払えません")

    if (this.displayingArea.hasSpace) this.switchEmployMode()
    else this.resetMode()
  }

  switchUnemployMode() {
    this.resetMode()
    this.unitCallbacks.click = "commandUnemployUnit"
    this.displayUnits(this.displayingArea.stayingUnits, this.unitCallbacks, "yellow")
  }

  commandUnemployUnit(unit) {
    if (!unit.active) return alert("既に行動済みのユニットです")
    else if (unit.isMaster) return alert("マスターは解雇できません")

    let go = window.confirm("この部隊を解雇してよろしいですか？")
    if (go) {
      this.displayingArea.unemployUnit(unit)
      this.displayMaster()
    }
    this.switchUnemployMode()
  }
}