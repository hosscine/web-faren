class StrategyMapStage extends createjs.Stage {
  constructor(canvas, assets, masters, player) {
    super(canvas)

    this.masters = masters
    this.playerMaster = player

    this.setup(assets)
  }

  setup(assets) {
    this.charadata = assets.charadata
    this.areaData = assets.areaData
    // for (master of this.masters) master.setMasterFlag()

    this.strategyMap = this.addChild(assets.strategyMap)
    this.headerBar = headerStage.addChild(new StrategyHeaderBar())
    this.sideBar = sidebarStage.addChild(new StrategySideBar(this.playerMaster))

    this.setupAreas(assets) // this.areas を作る
    this.strategyMap.setupAreaFlag(this.areas)
  }

  setupAreas(assets) {
    let neutralMaster = {}
    neutralMaster.flagBitmap = new MotionBitmap(assets.neutralFlag.canvas, FLAG_SIZE, FLAG_SIZE, FLAG_MOTION_INTERVAL)
    console.log(neutralMaster)
    this.areas = []
    for (let i in this.areaData.data) {
      let ownerID = assets.scenario.areaOwner[i]
      if (ownerID > 0) this.areas.push(new Area(this.areaData.data[i], this.masters[ownerID - 1]))
      else this.areas.push(new Area(this.areaData.data[i], neutralMaster))
    }
  }

  handleFileload(event) {
    if (event.item.id === "map") this.strategyMap = new StrategyMap(new createjs.Bitmap(event.result))
    else if (event.item.id === "charadata") this.charadata = new CharacterDataReader(event.result)
    else if (event.item.id === "areadata") this.areaData = new AreaDataReader(event.result)
    else if (event.item.id === "flag_neutral") this.neutralFlag = new AlphalizeBitmap(event.result)
    else event.item.unit.setMasterFlag(new AlphalizeBitmap(event.result))
  }
}

window.StrategyMapStage = createjs.promote(StrategyMapStage, "Stage")
