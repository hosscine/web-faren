class StrategyMapStage extends createjs.Stage {
  constructor(canvas, assets, masters, mastersDic, player) {
    super(canvas)

    this.masters = masters
    this.mastersDic = mastersDic
    this.playerMaster = player

    this.setup(assets)
  }

  setup(assets) {
    this.strategyMap = this.addChild(new StrategyMap(assets.strategyMap, HEADER_HEIGTH))
    this.headerBar = headerStage.addChild(new StrategyHeaderBar())
    this.sideBar = sidebarStage.addChild(new StrategySideBar(this.playerMaster, this, assets))

    this.neutralMaster = new NeutralMaster(assets.neutralFlag)

    this.setupAreas(assets) // this.areas を作る
    this.placeUniqueUnits(assets)
    this.strategyMap.setupAreaFlag(this.areas)
    for (let area of this.areas) area.initialEmployment()

    this.initializeTurn()
  }

  placeUniqueUnits(assets) {
    for (let locate of assets.scenario.initialLocation) {
      let id = locate.unitID
      let unit = assets.charadata.characters[id].isMaster ? this.mastersDic[id] : new Unit(id, assets)
      unit.moveToArea(this.areas[locate.areaID - 1])
      unit.rank = locate.unitRank
    }
  }

  setupAreas(assets) {
    this.areas = []
    for (let i in assets.areaData.data) {
      let ownerID = assets.scenario.areaOwner[i]
      const gameLevel = 4
      if (ownerID > 0)
        this.areas.push(new Area(assets.areaData.data[i], this.masters[ownerID - 1], this.areas, assets, this.sideBar, gameLevel))
      else
        this.areas.push(new Area(assets.areaData.data[i], this.neutralMaster, this.areas, assets, this.sideBar, gameLevel))
    }
  }

  initializeTurn() {
    // Fisher-Yates ランダム並び替え
    for (let i = this.masters.length - 1; i >= 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1))
      let temp = this.masters[i]
      this.masters[i] = this.masters[rand]
      this.masters[rand] = temp
    }
    this.turnRoutine(this.masters[0])
  }

  turnRoutine(master) {
    master.fund += master.income - master.outgo
    for (let area of master.dominatingAreas) area.executeAreaCommand()
    master.activateFollowerUnits()
    if (master.isPlayer) {
      master.stayingArea.sortStayingUnits()
      this.sideBar.displayArea(master.stayingArea)
      this.sideBar.displayMaster()
      return 0
    }
    else {
      console.log(master.name, "turn end")
      this.nextMasterTurn(master)
    }
  }

  nextMasterTurn(master) {
    let order = this.masters.indexOf(master)
    if (order === this.masters.length - 1) this.initializeTurn()
    else this.turnRoutine(this.masters[order + 1])
  }

  gotoBattleMap(target, attackMaster, attackUnits) {
    for (let unit of attackUnits) unit.active = false
    for (let unit of target.stayingUnits) unit.die()
    target.occupied(attackMaster, attackUnits)
    this.strategyMap.setupAreaFlag(this.areas)
    this.sidebar.displayMaster()
  }
}

window.StrategyMapStage = createjs.promote(StrategyMapStage, "Stage")
