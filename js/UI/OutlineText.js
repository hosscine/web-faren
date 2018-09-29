class OutlineText extends createjs.Container {
  constructor(text, font = "15px arial") {
    super()

    let frontText = new createjs.Text(text, font, "white")
    let outlineText = frontText.clone()
    outlineText.color = "black"
    outlineText.outline = 2
    this.addChild(outlineText, frontText)
  }

  set text(value) { for (let child of this.children) child.text = value }
  get text() { return (this.children[0].text) }
  set textAlign(value) { for (let child of this.children) child.textAlign = value }
}
