const DATA_DIR = "assets/Default/Data/"
const IMAGE_DIR = "assets/Default/DefChar/"
const PICTURE_DIR = "assets/Default/Picture/"
const ELEMENT_DIR = "assets/Default/Elements/"

const UNIT_PATTERN = /unit\d+/
const FACE_PATTERN = /face\d+/
const FLAG_PATTERN = /flag\d+/

function preloadAssets() {
  console.time("preload")

  assets.scriptManifest = [
    {
      id: "charadata",
      src: IMAGE_DIR + "CharacterData",
      type: createjs.LoadQueue.BINARY
    },
    {
      id: "areadata",
      src: DATA_DIR + "AreaData"
    },
    {
      id: "callable",
      src: DATA_DIR + "CallAble"
    }
  ]

  let handleScriptLoad = function (event) {
    if (event.item.id === "charadata") {
      assets.charadata = new CharacterDataReader(event.result)
      assets.imageManifest = assets.imageManifest.concat(assets.charadata.imageManifest)
      setupMasters("charadata")
    }
    else if (event.item.id === "areadata") assets.areaData = new AreaDataReader(event.result)
    else if (event.item.id === "callable") assets.callable = new TaggedCallableReader(event.result)
  }

  // スクリプト読み込み完了時に画像読み込みを開始
  let handleScriptComplete = function (event) {
    let imageQueue = new createjs.LoadQueue()
    imageQueue.setMaxConnections(1000)
    imageQueue.loadManifest(assets.imageManifest)
    imageQueue.on("progress", handleImageProgress)
    imageQueue.on("fileload", handleImageLoad)
    imageQueue.on("complete", handleImageComplete)
  }

  assets.imageManifest = [
    {
      id: "map",
      src: PICTURE_DIR + "FieldMap.png"
    },
    {
      id: "neutralFlag",
      src: PICTURE_DIR + "Flag0.png"
    }
  ]

  let handleImageProgress = function (event) {
    // console.log(event.progress)
  }

  let handleImageLoad = function (event) {
    let i = event.item
    if (i.id === "map") assets.strategyMap = new createjs.Bitmap(event.result)
    else if (i.id === "neutralFlag") assets.neutralFlag = new AlphalizeBitmap(event.result)
    else if (UNIT_PATTERN.test(i.id))
      for (let id of i.unitID) assets.charadata.characters[id].unitImage = new AlphalizeBitmap(event.result)
    else if (FACE_PATTERN.test(i.id))
      for (let id of i.unitID) assets.charadata.characters[id].faceImage = new AlphalizeBitmap(event.result)
    else if (FLAG_PATTERN.test(i.id))
      for (let id of i.unitID) assets.charadata.characters[id].flagImage = new AlphalizeBitmap(event.result)
  }

  // 画像読み込み完了時にユニットのインスタンスを作成
  let handleImageComplete = function (event) {
    setupMasters("image")
    console.timeEnd("preload")
  }

  let scriptQueue = new createjs.LoadQueue()
  scriptQueue.loadManifest(assets.scriptManifest)
  scriptQueue.on("fileload", handleScriptLoad)
  scriptQueue.on("complete", handleScriptComplete)

}

// シナリオ・マスター読み込み完了後
// CharacterData 読み込み完了後
// assetsの画像読み込み後
// の計3回呼び出される
function setupMasters(readyKey) {
  assets.readyFlag[readyKey] = true

  if (assets.readyFlag.scenario & assets.readyFlag.charadata) {
    stage.mastersDic = {}
    for (master of stage.masters) {
      master.setup(assets)
      stage.mastersDic[master.id] = master
    }
  }
}
