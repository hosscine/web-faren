const BB_Color = "#012279"

class StrategyHeaderBar extends createjs.Container {
  constructor(text, font = "20px arial", width = 100, height = 30) {
    super()

    this.width = 100
    this.height = 30
    this._text = text

    this.setup()
  }

  setup() {
    let background = this.addChild(new createjs.Shape())
    background.graphics.beginFill(BB_Color).drawRect(0, 0, this.width, this.height)

    this.textBox = this.addChild(new createjs.Text(this._text, this.font, "white"))
    nameText.y = 5
  }

  set text(text) {
    this._text = text
    this.textBox.text = text
  }
  get text() {
    return (this._text)
  }

}
