const STRATEGY_STATE = {
  default: 0,
  awaitEmployer: 10
}

class StrategyModel {
  constructor() {

  }

  employ() {
    this.resetState()
    if (!this.area.hasSpace) return alert("エリアに空きがありません")
    this.employerUnits = this.area.stayingUnits
    this.state = STRATEGY_STATE.awaitEmployer
  }

  resetState() {
    this.state = STRATEGY_STATE.default
  }

  switchEmployMode() {

  }

  set areaCommand(value) { this.areaCommand = value }
  get areaCommand() { return this.areaCommand }
}