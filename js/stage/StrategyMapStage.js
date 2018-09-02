const STRATEGY_MAP_PATH = "assets/Default/Picture/FieldMap.png"
const AREADATA_PATH = "assets/Default/Data/AreaData"
const CHARACTERDATA_PATH = IMAGE_DIR + "CharacterData"

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
        id: "charadata",
        src: CHARACTERDATA_PATH,
        type: "binary"
      },
      {
        id: "areadata",
        src: AREADATA_PATH
      },
      {
        id: "flag_neutral",
        src: IMAGE_DIR + "FlagTMP.png"
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
    this.headerBar = this.addChild(new StrategyHeaderBar())
    this.sideBar = this.addChild(new StrategySideBar(this.playerMaster))

    this.setupAreas() // this.areas を作る
    this.strategyMap.setupAreaFlag(this.areas)
  }

  setupAreas() {
    let neutralMaster = {}
    neutralMaster.flag = this.neutralFlag
    this.areas = []
    for (let i in this.areaData.data) {
      let ownerID = scenario.areaOwner[i]
      if (ownerID > 0) this.areas.push(new Area(this.areaData.data[i], this.masters[ownerID - 1]))
      else this.areas.push(new Area(this.areaData.data[i], neutralMaster))
    }
  }

  handleFileload(event) {
    if (event.item.id === "map") this.strategyMap = new StrategyMap(new createjs.Bitmap(event.result), HEADER_HEIGTH)
    else if (event.item.id === "charadata") this.charadata = new CharacterDataReader(event.result)
    else if (event.item.id === "areadata") this.areaData = new AreaDataReader(event.result)
    else if (event.item.id === "flag_neutral") this.neutralFlag = new AlphalizeBitmap(event.result)
    else event.item.unit.setMasterFlag(new AlphalizeBitmap(event.result))
  }
}

window.StrategyMapStage = createjs.promote(StrategyMapStage, "Stage")
