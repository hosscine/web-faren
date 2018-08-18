const STRATEGY_MAP_PATH = "assets/Default/Picture/FieldMap.png"

class StrategyMapStage extends createjs.Stage {
  constructor(canvas) {
    super(canvas)

    let queue = new createjs.LoadQueue(true)
    queue.on("fileload", (event) => this.StrategyMap = new StrategyMap(new createjs.Bitmap(event.result)))
    queue.on("complete", (event) => this.setup())
    queue.loadFile(STRATEGY_MAP_PATH)
    queue.load()
  }

  setup() {
    this.addChild(this.StrategyMap)
    this.addChild(new StrategyHeaderBar())
  }
}

window.StrategyMapStage = createjs.promote(StrategyMapStage, "Stage")
