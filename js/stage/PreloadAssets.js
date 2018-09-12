const DATA_DIR = "assets/Default/Data/"
const IMAGE_DIR = "assets/Default/DefChar/"
const PICTURE_DIR = "assets/Default/Picture/"
const ELEMENT_DIR = "assets/Default/Elements/"

const UNIT_PATTERN = /unit\d+/
const FACE_PATTERN = /face\d+/
const FLAG_PATTERN = /flag\d+/

const STRATEGY_MAP_PATH = "assets/Default/Picture/FieldMap.png"
const AREADATA_PATH = "assets/Default/Data/AreaData"
const CHARACTERDATA_PATH = IMAGE_DIR + "CharacterData"

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
    }
  ]

  let handleScriptLoad = function(event) {
    if (event.item.id === "charadata") {
      assets.charadata = new CharacterDataReader(event.result)
      assets.imageManifest = assets.imageManifest.concat(assets.charadata.imageManifest)
    } else if (event.item.id === "areadata") assets.areaData = new AreaDataReader(event.result)
  }

  // スクリプト読み込み完了時に画像読み込みを開始
  let handleScriptComplete = function(event) {
    let imageQueue = new createjs.LoadQueue()
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

  let handleImageProgress = function(event) {
    // console.log(event.progress)
  }

  let handleImageLoad = function(event) {
    let i = event.item
    if (i.id === "map") assets.strategyMap = new createjs.Bitmap(event.result)
    else if (i.id === "neutralFlag") assets.neutralFlag = new AlphalizeBitmap(event.result)
    else if (UNIT_PATTERN.test(i.id)) assets.charadata.characters[i.unitID].unitImage = new AlphalizeBitmap(event.result)
    else if (FACE_PATTERN.test(i.id)) assets.charadata.characters[i.unitID].faceImage = new AlphalizeBitmap(event.result)
    else if (FLAG_PATTERN.test(i.id)) assets.charadata.characters[i.unitID].flagImage = new AlphalizeBitmap(event.result)
  }

  // 画像読み込み完了時にユニットのインスタンスを作成
  let handleImageComplete = function(event) {
    for (master of assets.masters) master.setup(assets)
    console.timeEnd("preload")
  }

  let scriptQueue = new createjs.LoadQueue()
  scriptQueue.loadManifest(assets.scriptManifest)
  scriptQueue.on("fileload", handleScriptLoad)
  scriptQueue.on("complete", handleScriptComplete)

}
