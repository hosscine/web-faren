const EXPLANATION_HEIGHT = 220

class ExplanationArea extends createjs.Container {
  constructor() {
    super()

    this.setup()
  }

  setup() {
    let background = this.addChild(new createjs.Shape())
    background.graphics.beginFill("lightgray").drawRect(0, 0, 1280, EXPLANATION_HEIGHT)
    this.y = 500

    let nameText = this.addChild(new createjs.Text("", "25px arial oblique", "darkred"))
    nameText.x = 100
    nameText.y = 50

    let explanationText = this.addChild(new createjs.Text("", "25px arial"))
    explanationText.x = 100
    explanationText.y = 90

    let difficultyText = this.addChild(new createjs.Text("難易度", "25px arial"))
    difficultyText.x = 800
    difficultyText.y = 50

    let difficultyMark = this.addChild(new createjs.Text("⭐️⭐️⭐️⭐️⭐️", "30px arial", "yellow"))
    difficultyMark.x = 800
    difficultyMark.y = 80

    this.texts = {
      name: nameText,
      explanation: explanationText,
      difficulty: difficultyMark
    }
  }

  displayMaster(master) {
    let exptext = ""
    for (let i in master.explanation) exptext += master.explanation[i] + "\n"

    this.texts.name.text = master.name
    this.texts.explanation.text = exptext
    this.texts.difficulty.text = master.difficulty
  }
}
