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
      case STRATEGY_STATE.awaitAttackers:
        this.model.moveBins2Bins(unit); break
      case STRATEGY_STATE.default:
        this.view.displayUnitDetail(unit); break
    }
    this.displayUnits()
    this.view.displayMaster(this.player)
  }

  handleUnitMouseover(unit) {
    let isAbove = this.model.isInMainUnits(unit)
    if (isAbove) this.view.unitOverview.y = 600
    if (this.isSP) this.view.unitOverview.y = 0
    this.view.displayUnitOverview(unit)
  }

  handleUnitMouseout(unit) {
    this.view.undisplayUnitOverview(unit)
  }

  handleUnitPressmove(unit) { this.handleUnitMouseover(unit) }
  handleUnitPressup(unit) { this.handleUnitMouseout(unit) }

  handleAreaClick(area) {
    let needDisplay = false
    switch (this.model.state) {
      case STRATEGY_STATE.awaitWarTarget:
      case STRATEGY_STATE.awaitAttackers:
        needDisplay = this.model.setWarTarget(area); break
      case STRATEGY_STATE.awaitMoveTarget:
      case STRATEGY_STATE.awaitMovers:
        needDisplay = this.model.setMoveTarget(area); break
      case STRATEGY_STATE.default:
        needDisplay = true; break
    }

    if (needDisplay) {
      this.model.area = area
      this.view.displayArea(area)
      this.view.selectAreaCommand(area.command)
      this.view.commandsVisible = area.owner === this.player
    }
    this.displayUnits()
  }

  handleWar() {
    this.model.startWar()
    this.displayUnits()
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
    this.model.allMoveTo(moveto === "toUnder" ? "toSub" : "toMain")
    this.displayUnits()
  }

  handleMoveSubmit() {
    let attackers = this.model.getAttackers()
    if (attackers) this.mainStage.gotoBattleMap(this.model.targetArea, this.player, attackers)

    this.displayUnits()
  }

  handleMove() {
    this.model.startMove()
    this.displayUnits()
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

  displayMaster(master) {
    this.view.displayMaster(master)
  }

  initializeBinsSet() {
    this.binsSet = {}
    for (let area of this.displayingArea.adjacentAreas) this.binsSet[area.name] = area.getStayingUnits20Bins()
    this.binsSet[this.displayingArea.name] = this.displayingArea.getStayingUnits20Bins()
  }

  reflow(w, h, sp) {
    if (sp) this.reflowSP(w, h)
    else this.reflowPC(w, h)
    this.isSP = sp
  }

  reflowSP(w, h) {
    let v = this.view
    let fitMag = w / 2.1 / v.columnWidth
    // if 縦が見切れる場合  縦にフィット
    // else 見切れない場合  横にフィット
    if (fitMag * v.columnHeight > h) v.scaleX = v.scaleY = h / v.columnHeight
    else v.scaleX = v.scaleY = fitMag

    v.stayingUnitsContainer.x = 200
    v.stayingUnitsContainer.y = v.columnHeight / 2.57
    v.unitCommandsContainer.x = 200
    v.unitCommandsContainer.y = v.columnHeight - 210
    v.unitOverview.x = 200
  }

  reflowPC(w, h) {
    console.log("reflowPC called")
  }
}