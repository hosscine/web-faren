class ExplanationArea extends createjs.Container {
  constructor() {
    super()

    this.setup()
  }

  setup() {
    let background = this.addChild(new createjs.Shape())
    background.graphics.beginFill("lightgray").drawRect(0, 0, 1280, 220)
    this.y = 500

    let nameText = this.addChild(new createjs.Text("name", "25px arial oblique", "darkred"))
    nameText.x = 200
    nameText.y = 30

    let explanationText = this.addChild(new createjs.Text("explanation", "25px arial"))
    explanationText.x = 200
    explanationText.y = 60

    let difficultyText = this.addChild(new createjs.Text("難易度", "25px arial"))
    difficultyText.x = 800
    difficultyText.y = 50

    let difficultyMark = this.addChild(new createjs.Text("⭐️", "30px arial"))
    difficultyMark.x = 800
    difficultyMark.y = 80
  }

  displayMaster(master) {

  }
}
