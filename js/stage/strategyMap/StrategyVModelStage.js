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
    let needDisplay = false
    switch (this.model.state) {
      case STRATEGY_STATE.awaitWarTarget:
      case STRATEGY_STATE.awaitAttackers:
        needDisplay = this.model.setWarTarget(area); break
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

  reflow(w, h, sp) {
    if (sp) this.reflowSP(w, h)
    else this.reflowPC(w, h)
  }

  reflowSP(w, h) {
    if (w >= 400) this.view.scaleX = this.view.scaleY = h / this.view.columnHeight
    else this.view.scaleX = this.view.scaleY = w / 200

    // this.view.scaleX = this.view.scaleY = 2
    // let bb = this.view.masterContainer.addChild(new createjs.Shape())
    // bb.graphics.beginStroke("white").drawRect(0,0,200, 190)
    // let aa = this.view.areaInfoContainer.addChild(new createjs.Shape())
    // aa.graphics.beginStroke("red").drawRect(0,0,200, 100)
  }

  reflowPC(w, h) {
    console.log("reflowPC called")
  }
}