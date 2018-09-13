class SidebarStage extends createjs.Stage {
  constructor(canvas) {
    super(canvas)
  }

  displayScenario(scenarioData) {
    this.scenarioInfo = this.addChild(new createjs.Container())

    let background = this.scenarioInfo.addChild(new createjs.Shape())
    background.graphics.beginFill("darkblue").drawRect(0, 0, SIDEBAR_WIDTH, 2000)

    let name = this.scenarioInfo.addChild(new createjs.Text(scenarioData.Name, "18px arial", "white"))
    name.y = 10

    let explanation = this.scenarioInfo.addChild(new createjs.Text("", "16px arial", "white"))
    explanation.lineWidth = SIDEBAR_WIDTH
    explanation.x = 3
    explanation.y = 40
    setWrapText(explanation, scenarioData.Explanation.join("\n"))
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
