const HEADER_HEIGTH = 45
const HEADER_ITEM_MARGINE = 5

class StrategyHeaderBar extends createjs.Container {
  constructor() {
    super()

    this.setup()
  }

  setup() {
    let background = this.addChild(new createjs.Shape())
    background.graphics.beginFill("lightgray").drawRect(0, 0, 1280, HEADER_HEIGTH)

    this.leftTextBox = this.addChild(new BBText(""))
    this.leftTextBox.x = HEADER_ITEM_MARGINE
    this.leftTextBox.y = HEADER_ITEM_MARGINE
    this.location = "自宅"

    this.rightTextBox = this.addChild(new BBText(""))
    this.rightTextBox.x = 1280 - HEADER_ITEM_MARGINE - this.rightTextBox.width
    this.rightTextBox.y = HEADER_ITEM_MARGINE
    this.turn = 0
  }

  set location(location){
    this.leftTextBox.text = location
  }

  set turn(turn){
    this.rightTextBox.text = "第" + turn + "ターン"
  }

}
