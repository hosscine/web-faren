class StrategyMapStage extends createjs.Stage {
  constructor(canvas, assets, masters, mastersDic, player) {
    super(canvas)

    this.masters = masters
    this.mastersDic = mastersDic
    this.playerMaster = player

    this.setup(assets)
  }

  setup(assets) {
    this.charadata = assets.charadata
    this.areaData = assets.areaData

    this.strategyMap = this.addChild(new StrategyMap(assets.strategyMap, HEADER_HEIGTH))
    this.headerBar = headerStage.addChild(new StrategyHeaderBar())
    this.sideBar = sidebarStage.addChild(new StrategySideBar(this.playerMaster))

    this.neutralMaster = new NeutralMaster(assets.neutralFlag)

    this.setupAreas(assets) // this.areas を作る
    this.placeUniqueUnits(assets)
    this.strategyMap.setupAreaFlag(this.areas)
    for (let area of this.areas) area.initialEmployment()
  }

  placeUniqueUnits(assets) {
    for (let locate of assets.scenario.initialLocation) {
      let id = locate.unitID
      let unit = assets.charadata.characters[id].isMaster ? this.mastersDic[id] : new Unit(id, assets)
      this.areas[locate.areaID - 1].placeUnits(unit)
      unit.rank = locate.unitRank
    }
  }

  setupAreas(assets) {
    this.areas = []
    for (let i in this.areaData.data) {
      let ownerID = assets.scenario.areaOwner[i]
      const gameLevel = 4
      if (ownerID > 0)
        this.areas.push(new Area(this.areaData.data[i], this.masters[ownerID - 1], this.areas, assets, this.sideBar, gameLevel))
      else 
        this.areas.push(new Area(this.areaData.data[i], this.neutralMaster, this.areas, assets, this.sideBar, gameLevel))
    }
  }

}

window.StrategyMapStage = createjs.promote(StrategyMapStage, "Stage")
