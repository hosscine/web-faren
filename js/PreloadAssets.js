const DATA_DIR = "assets/Default/Data/"
const IMAGE_DIR = "assets/Default/DefChar/"
const PICTURE_DIR = "assets/Default/Picture/"
const ELEMENT_DIR = "assets/Default/Elements/"

// エリア数　なんとか取得する形にしたい
const NUM_AREAS = 61

// Bitmap Chipのサイズ
const MINI_CHIP_SIZE = 32

const BMAP_PATTERN = /battlemap\d+/
const UNIT_PATTERN = /unit\d+/
const FACE_PATTERN = /face\d+/
const FLAG_PATTERN = /flag\d+/

function preloadAssets() {
  console.time("preload")

  assets = { battleMap: new Array(NUM_AREAS) }

  assets.scriptManifest = [
    {
      id: "charadata",
      src: IMAGE_DIR + "CharacterData",
      type: createjs.LoadQueue.BINARY
    },
    {
      id: "scenario",
      src: DATA_DIR + "Scenario1"
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

  for (let i = 1; i <= NUM_AREAS; i++) assets.scriptManifest.push({
    id: "battlemap" + i,
    src: DATA_DIR + "BMap_No" + i,
    type: createjs.LoadQueue.BINARY,
    areaNo: i
  })

  let handleScriptLoad = function (event) {
    if (event.item.id === "charadata") {
      assets.charadata = new CharacterDataReader(event.result)
      assets.imageManifest = assets.imageManifest.concat(assets.charadata.imageManifest)
    }
    else if (event.item.id === "scenario") assets.scenario = new TaggedScenarioReader(event.result)
    else if (event.item.id === "areadata") assets.areaData = new AreaDataReader(event.result)
    else if (event.item.id === "callable") assets.callable = new TaggedCallableReader(event.result)
    else if (BMAP_PATTERN.test(event.item.id)) assets.battleMap[event.item.areaNo] = new BattleMapReader(event.result)
  }

  // スクリプト読み込み完了時に画像読み込みを開始
  let handleScriptComplete = function (event) {
    let imageQueue = new createjs.LoadQueue()
    imageQueue.setMaxConnections(10000)
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
    },
    {
      id: "backgroundChips",
      src: PICTURE_DIR + "BMAPCHAR.png"
    }
  ]

  let handleImageProgress = function (event) {
    // console.log(event.progress)
  }

  let handleImageLoad = function (event) {
    let i = event.item
    if (i.id === "map") assets.strategyMap = new createjs.Bitmap(event.result)
    else if (i.id === "neutralFlag") assets.neutralFlag = new AlphalizeBitmap(event.result)
    else if (i.id === "backgroundChips") assets.backgroundChips = new BitmapChips(event.result, MINI_CHIP_SIZE)
    else if (UNIT_PATTERN.test(i.id))
      for (let id of i.unitID) assets.charadata.characters[id].unitImage = new AlphalizeBitmap(event.result)
    else if (FACE_PATTERN.test(i.id))
      for (let id of i.unitID) assets.charadata.characters[id].faceImage = new AlphalizeBitmap(event.result)
    else if (FLAG_PATTERN.test(i.id))
      for (let id of i.unitID) assets.charadata.characters[id].flagImage = new AlphalizeBitmap(event.result)
  }

  // 画像読み込み完了時に各ステージにデータを渡す
  let handleImageComplete = function (event) {
    stage.setup(assets.scenario.masters, assets)
    sidebarStage.displayScenario(assets.scenario.data)

    console.timeEnd("preload")
  }

  // スクリプトの読み込み開始
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
