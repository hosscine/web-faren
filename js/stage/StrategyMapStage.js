class StrategyMapStage extends createjs.Stage {
  constructor(canvas) {
    super(canvas)

    this.setup()
  }

  setup() {
    this.addChild(new StrategyHeaderBar())
  }
}

window.StrategyMapStage = createjs.promote(StrategyMapStage, "Stage")
