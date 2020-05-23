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
    console.log("lets back to strategy")
    this.visible = false
    stage.visible = true

    // このtickをかけるのがクソ重要みたい
    createjs.Ticker.addEventListener("tick", stage)
    createjs.Ticker.setFPS(60)
  }

}

window.BattleMapStage = createjs.promote(BattleMapStage, "Stage")
