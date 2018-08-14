const BB_Color = "#012279"

class BBText extends createjs.Container {
  constructor(text, font = "20px arial", width = 200, height = 30) {
    super()

    this.width = width
    this.height = height
    this._text = text
    this.font = font
    this.width = width
    this.height = height

    this.setup()
  }

  setup() {
    let background = this.addChild(new createjs.Shape())
    background.graphics.beginFill(BB_Color).drawRect(0, 0, this.width, this.height)

    console.log(this.font)
    this.textBox = this.addChild(new createjs.Text(this._text, this.font, "white"))
    this.textBox.x = 5
    this.textBox.y = 5
  }

  set text(text) {
    this._text = text
    this.textBox.text = text
  }
  get text() {
    return (this._text)
  }

}
