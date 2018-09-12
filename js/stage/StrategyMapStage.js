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

    this.strategyMap = this.addChild(new StrategyMap(assets.strategyMap, HEADER_HEIGTH))
    this.headerBar = headerStage.addChild(new StrategyHeaderBar())
    this.sideBar = sidebarStage.addChild(new StrategySideBar(this.playerMaster))

    this.setupAreas(assets) // this.areas を作る
    this.placeUniqueUnits(assets)
    this.strategyMap.setupAreaFlag(this.areas)
  }

  placeUniqueUnits(assets) {
    for (let locate of assets.scenario.initialLocation){
      let unitID = assets.charadata.nameIdHash[locate.unitName]
      let unit = assets.charadata.characters[unitID].isMaster ? assets.masters[unitID] : new Unit(unitID, assets)
      this.areas[locate.areaID - 1].placeUnits(unit)
      unit.rank = locate.unitRank
    }
  }

  setupAreas(assets) {
    this.areas = []
    for (let i in this.areaData.data) {
      let ownerID = assets.scenario.areaOwner[i]
      if (ownerID > 0) this.areas.push(new Area(this.areaData.data[i], this.masters[ownerID - 1]))
      else {
        let neutralMaster = {}
        neutralMaster.flagBitmap = new MotionBitmap(assets.neutralFlag.canvas, FLAG_SIZE, FLAG_SIZE, FLAG_MOTION_INTERVAL)
        this.areas.push(new Area(this.areaData.data[i], neutralMaster))
      }
    }
  }

}

window.StrategyMapStage = createjs.promote(StrategyMapStage, "Stage")
