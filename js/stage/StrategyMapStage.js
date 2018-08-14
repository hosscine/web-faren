class StrategyMapStage extends createjs.Stage {
  constructor(canvas) {
    super(canvas)

    setup()
  }

  setup() {
    this.addChild(new StrategyHeaderBar())
  }
}

window.StrategyMapStage = createjs.promote(StrategyMapStage, "Stage")
