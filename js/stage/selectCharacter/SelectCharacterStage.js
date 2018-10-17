const SELECTABLE_FACE_MARGINE = 40

class SelectCharacterStage extends createjs.Stage {
  constructor(canvas) {
    super(canvas)
  }

  setup(masters, assets) {
    this.masters = masters
    this.assets = assets

    // unitidでアクセスできるマスターの連想配列を作成
    this.mastersDic = {}
    for (let master of masters) {
      master.setup(assets)
      this.mastersDic[master.id] = master
    }

    this.faceContainer = this.addChild(new ScrollContainer())
    this.explanationArea = this.addChild(new ExplanationArea())

    this.displayMasters()
    this.mastersEnable = true
  }

  displayMasters() {
    for (let i in this.masters) {
      let bmp = this.faceContainer.addChild(this.masters[i].selectableFaceBitmap)
      let id = parseInt(i)
      let row = id % 2
      let col = (id - id % 2)

      bmp.scaleX = bmp.scaleY = 2
      bmp.x = col / 2 * bmp.getChildAt(0).getBounds().width * bmp.scaleX +
        col * SELECTABLE_FACE_MARGINE + SELECTABLE_FACE_MARGINE
      bmp.y = row * bmp.getChildAt(0).getBounds().height * bmp.scaleY +
        SELECTABLE_FACE_MARGINE * row + bmp.getChildAt(1).getMeasuredHeight() * 2 * row
    }

    // this.faceContainer の contentWidth と contentHeight を計算
    let ncols = this.masters.length / 2 + this.masters.length % 2
    let faceSample = this.faceContainer.children[0]
    let faceWidth = faceSample.getChildAt(0).getBounds().width * faceSample.scaleX // 顔についてる名前テキストの長さ * スケール
    this.faceContainer.setContentBounds(faceWidth * ncols + SELECTABLE_FACE_MARGINE * ncols * 2,
      contentHeightDefault - EXPLANATION_HEIGHT)
    // this.faceContainer.contentWidth = faceWidth * ncols + SELECTABLE_FACE_MARGINE * ncols * 2
    // this.faceContainer.contentHeight = contentHeightDefault - EXPLANATION_HEIGHT
  }

  gotoStrategyMap(playerMaster) {
    playerMaster.isPlayer = true
    this.mastersEnable = false
    sidebarStage = new StrategyVModelStage(this.canvas, playerMaster, stage, this.assets)
    stage = new StrategyMapStage(this.canvas, this.assets, this.masters, this.mastersDic, playerMaster)
    if (createjs.Touch.isSupported()) createjs.Touch.enable(stage)
    createjs.Ticker.addEventListener("tick", stage)
    createjs.Ticker.setFPS(60)
  }

  set mastersEnable(bool) {
    let handleClick = (event, data) => {
      let go = window.confirm(data.master.name + "でゲームを開始します")
      if (go) this.gotoStrategyMap(data.master)
    }
    let handleMouseover = (event, data) => this.explanationArea.displayMaster(data.master)

    for (let face of this.faceContainer.children) {
      // if    bool = true ならマスターの顔絵にイベントリスナーを追加
      // else  bool = false ならイベントリスナーを削除
      if (bool) {
        face.on("click", handleClick, null, false, { master: face.himself })
        face.on("mouseover", handleMouseover, null, false, { master: face.himself })
      }
      else face.removeAllEventListeners()
    }
  }
}

window.SelectCharacterStage = createjs.promote(SelectCharacterStage, "Stage")
