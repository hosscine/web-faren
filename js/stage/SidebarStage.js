class SidebarStage extends createjs.Stage {
  constructor(canvas) {
    super(canvas)
  }

  displayScenario(scenarioData) {
    this.scenarioData = scenarioData
    this.scenarioInfo = this.addChild(new createjs.Container())

    this.background = this.scenarioInfo.addChild(new createjs.Shape())
    this.background.graphics.beginFill("darkblue").drawRect(0, 0, this.canvas.clientWidth, 2000)

    let name = this.scenarioInfo.addChild(new createjs.Text(scenarioData.Name, "18px arial", "white"))
    name.y = 10

    this.explanation = this.scenarioInfo.addChild(new createjs.Text("", "16px arial", "white"))
    this.explanation.lineWidth = this.canvas.clientWidth
    this.explanation.x = 3
    this.explanation.y = 40
    setWrapText(this.explanation, scenarioData.Explanation.join("\n"))
  }

  reflow() {
    if (!this.background || !this.explanation) return
    this.background.graphics.clear().beginFill("darkblue").drawRect(0, 0, this.canvas.clientWidth, 2000)
    this.explanation.lineWidth = this.canvas.clientWidth
    setWrapText(this.explanation, this.scenarioData.Explanation.join("\n"))
  }
}

/**
 * @description
 * `Text`クラスのインスタンス`textInstance`の`text`プロパティに、
 * `textInstance`の幅をはみ出さないように、自動で折り返した`text`を格納する。
 * @param {Text} textInstance 自動で折り返した`text`を格納する`Text`クラスのインスタンス
 * @param {string} text `textInstance.text`に格納する自動で折り返す文字列
 */
function setWrapText(textInstance, text) {
  var initWidth = textInstance.lineWidth
  var textArray = text.split('')
  var i = -1
  var prevText = ''
  var lines = []

  textInstance.text = ''

  while (textArray[++i]) {
    textInstance.text += textArray[i]

    if (textInstance.getMeasuredWidth() > initWidth || textArray[i] === "\n") {
      lines.push(prevText)
      textInstance.text = textArray[i]
    }
    prevText = textInstance.text
  }

  textInstance.text = lines.join('\n')
}
