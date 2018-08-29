const STRATEGY_MAP_PATH = "assets/Default/Picture/FieldMap.png"
const AREADATA_PATH = "assets/Default/Data/AreaData"
const FLAG_SIZE = 32
const FLAG_MOTION_INTERVAL = 1000

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
    this.addChild(this.strategyMap)
    this.addChild(new StrategyHeaderBar())

     // フラッグテスト用
    let testFlag = new MotionBitmap(this.playerMaster.flag.canvas, FLAG_SIZE, FLAG_SIZE, FLAG_MOTION_INTERVAL)
    this.strategyMap.addChild(testFlag)
    testFlag.x = 250
    testFlag.y = 150
    this.testFlag = testFlag

    this.strategyMap.setupAreaFlag()
  }

  handleFileload(event) {
    if (event.item.id === "map") this.strategyMap = new StrategyMap(new createjs.Bitmap(event.result))
    else if (event.item.id === "areadata") this.areaData = new AreaDataReader(event.result)
    else event.item.unit.setMasterFlag(new AlphalizeBitmap(event.result))
  }
}

window.StrategyMapStage = createjs.promote(StrategyMapStage, "Stage")
