const STRATEGY_MAP_PATH = "assets/Default/Picture/FieldMap.png"
const AREADATA_PATH = "assets/Default/Data/AreaData"
const FLAG_SIZE = 32

class StrategyMapStage extends createjs.Stage {
  constructor(canvas, masters, player) {
    super(canvas)

    this.masters = masters
    this.playerMaster = player

    let queue = new createjs.LoadQueue(true)
    queue.on("fileload", (event) => this.handleFileload(event))
    queue.on("complete", (event) => this.setup())
    let manifest = [
      {
        id: "map",
        src: STRATEGY_MAP_PATH
      },
      {
        id: "areadata",
        src: AREADATA_PATH
      }
    ]
    for(let i in this.masters)
      manifest.push({
        id: "flag" + i,
        src: IMAGE_DIR + "Flag" + (parseInt(i) + 1) + ".png",
        unit: this.masters[i]
      })
    queue.loadManifest(manifest)
    queue.load()
  }

  setup() {
    this.addChild(this.StrategyMap)
    this.addChild(new StrategyHeaderBar())
    this.StrategyMap.addChild(this.playerMaster.flag) // フラッグテスト用
    this.playerMaster.flag.x = 450
    this.playerMaster.flag.y = 150
    this.playerMaster.flag.setupMotionMasks()
  }

  handleFileload(event) {
    if (event.item.id === "map") this.StrategyMap = new StrategyMap(new createjs.Bitmap(event.result))
    else if (event.item.id === "areadata") this.areaData = new AreaDataReader(event.result)
    else event.item.unit.setMasterFlag(new Flag(event.result, FLAG_SIZE, FLAG_SIZE))
  }
}

window.StrategyMapStage = createjs.promote(StrategyMapStage, "Stage")
