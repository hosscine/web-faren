class Button extends createjs.Container {
  constructor(text, width, height) {
    super()

    this.setup(text)

    this.width = width
    this.height = height
    this.fillColor = "lightgray"
    this.selected = false

    this.alignText()
  }

  setup(text) {
    this.background = this.addChild(new createjs.Shape())
    this.buttonText = this.addChild(new createjs.Text(text, "15px arial", "black"))
  }

  alignText() {
    this.buttonText.regX = this.buttonText.getMeasuredWidth() / 2
    this.buttonText.regY = this.buttonText.getMeasuredHeight() / 2
    this.buttonText.x = this._width / 2
    this.buttonText.y = this._height / 2
  }

  set selected(value) {
    this._selected = value
    if (value) this.fillColor = "darkgray"
    else this.fillColor = "lightgray"
  }
  get selected() {
    return this._selected
  }

  set text(value) {
    this.buttonText.text = value
    this.alignText()
  }

  set width(value) {
    this._width = value
    this.fillColor = this._fillColor
    this.alignText()
  }

  set height(value) {
    this._height = value
    this.fillColor = this._fillColor
    this.alignText()
  }

  set font(value) {
    this.buttonText.font = value
    this.alignText()
  }

  set textColor(value) {
    this.buttonText.color = value
  }

  set fillColor(value) {
    this._fillColor = value
    this.background.graphics.clear()
    this.background.graphics.beginFill(value).drawRect(0, 0, this._width, this._height)
  }
}
