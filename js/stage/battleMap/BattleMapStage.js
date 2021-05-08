class BattleMapStage extends createjs.Stage {
  constructor(canvas, defenseArea, attackUnits) {
    super(canvas)

    this.defenseArea = defenseArea
    this.attackUnits = attackUnits
    this.defenseUnits = defenseArea.stayingUnits

    this.setup(assets)
  }

  setup(assets) {
    this.testbutton = this.addChild(new Button("go to strategy", 100, 100))
    this.testbutton.on("click", () => this.gotoStrategyMap())
    this.battleMap = this.addChild(new BattleMap(assets.battleMap[1]))
  }

  gotoStrategyMap() {
    this.visible = false
    stage.focusOn()
  }

}

window.BattleMapStage = createjs.promote(BattleMapStage, "Stage")
