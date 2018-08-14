class StrategyHeaderBar extends createjs.Container {
  constructor() {
    super()

    this.setup()
  }

  setup() {
    let background = this.addChild(new createjs.Shape())
    background.graphics.beginFill("lightgray").drawRect(0, 0, 1280, 30)

    this.leftText = this.addChild(new BBText("LEFT"))

    this.rightText = this.addChild(new BBText("RIGHT"))
    this.rightText.x = 1000
  }

}
