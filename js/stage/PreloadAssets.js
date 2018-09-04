const DATA_DIR = "assets/Default/Data/"
const IMAGE_DIR = "assets/Default/DefChar/"
const PICTURE_DIR = "assets/Default/Picture/"
const ELEMENT_DIR = "assets/Default/Elements/"

const STRATEGY_MAP_PATH = "assets/Default/Picture/FieldMap.png"
const AREADATA_PATH = "assets/Default/Data/AreaData"
const CHARACTERDATA_PATH = IMAGE_DIR + "CharacterData"

function preloadAssets() {
  assets = {}
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

  let handleScriptComplete = function(event) {
    let imageQueue = new createjs.LoadQueue()
    imageQueue.loadManifest(assets.imageManifest)
    imageQueue.on("progress", handleImageProgress)
    imageQueue.on("fileload", handleImageLoad)
    imageQueue.on("complete", () => console.timeEnd("preload"))
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
    if (event.item.id === "map") assets.strategyMap = new StrategyMap(new createjs.Bitmap(event.result), HEADER_HEIGTH)
    else if (event.item.id === "neutralFlag") assets.neutralFlag = new AlphalizeBitmap(event.result)
    else if (/Char\d+/.test(event.item.id)) event.item.data.unitImage = event.result
    else if (/Face\d+/.test(event.item.id)) event.item.data.faceImage = event.result
    else if (/Flag\d+/.test(event.item.id)) event.item.data.flagImage = event.result
  }

  let scriptQueue = new createjs.LoadQueue()
  scriptQueue.loadManifest(assets.scriptManifest)
  scriptQueue.on("fileload", handleScriptLoad)
  scriptQueue.on("complete", handleScriptComplete)

}
