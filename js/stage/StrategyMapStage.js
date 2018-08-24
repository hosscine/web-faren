const STRATEGY_MAP_PATH = "assets/Default/Picture/FieldMap.png"
const AREADATA_PATH = "assets/Default/Data/AreaData"

class StrategyMapStage extends createjs.Stage {
  constructor(canvas) {
    super(canvas)

    let queue = new createjs.LoadQueue(true)
    queue.on("fileload", (event) => this.handleFileload(event))
    queue.on("complete", (event) => this.setup())
    queue.loadManifest([
      {
        id: "map",
        src: STRATEGY_MAP_PATH
      },
      {
        id: "areadata",
        src: AREADATA_PATH
      }
    ])
    // queue.loadFile(STRATEGY_MAP_PATH)
    queue.load()
  }

  setup() {
    this.addChild(this.StrategyMap)
    this.addChild(new StrategyHeaderBar())
  }

  handleFileload(event) {
    if (event.item.id === "map") this.StrategyMap = new StrategyMap(new createjs.Bitmap(event.result))
    else if (event.item.id === "areadata") this.areaData = new AreaDataReader(event.result)
  }
}

window.StrategyMapStage = createjs.promote(StrategyMapStage, "Stage")
