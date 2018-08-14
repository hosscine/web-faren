const MASTER_PATTERN = /Master(\d+)/
const IMAGE_DIR = "assets/Default/DefChar"

class TaggedScenarioReader extends TaggedTextReader {
  constructor(path, selectCharacterStage) {
    super(path)

    this.stage = selectCharacterStage
    this.masters = []
    this.manifest = []
  }

  parseScenario() {
    for (let tag in this.data) {
      if (MASTER_PATTERN.test(tag)) this.parseMaster(tag, this.data[tag])
    }

    let faceQueue = new createjs.LoadQueue(false)
    faceQueue.loadManifest(this.manifest)
    faceQueue.on("fileload", (event) => event.item.unit.setup(new createjs.Bitmap(event.result)))
    faceQueue.on("complete", () => this.stage.setup(this.masters))
  }

  parseMaster(tag, contents) {
    let id = parseInt(MASTER_PATTERN.exec(tag)[1])
    let name = contents[0]
    let difficulty = contents[1]
    let explanation = contents.slice(2, 5)

    let master = new MasterUnit(id, name, difficulty, explanation)

    this.manifest.push({
      id: tag,
      src: IMAGE_DIR + "/Face" + id + ".png",
      unit: master
    })
    this.masters.push(master)
  }

  getSelectCharacterStage(canvas) {
    this.stage = new SelectCharacterStage(canvas, this.masters)
    return(this.stage)
  }

  delegateScenarioComplete() {
    this.parseScenario()
  }

  delegateFaceComplete() {
    console.log("delegateFaceComplete is not implemented yet in:", this)
  }

}
