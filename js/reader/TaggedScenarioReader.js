const MASTER_PATTERN = /Master(\d+)/
const AREA_PATTERN = /Area/

class TaggedScenarioReader extends TaggedTextReader {
  constructor(path) {
    super(path)

    this.masters = []
    this.manifest = []
  }

  parseScenario() {
    for (let tag in this.data) {
      if (MASTER_PATTERN.test(tag)) this.parseMaster(tag, this.data[tag])
      else if(AREA_PATTERN.test(tag)) this.parseArea(this.data.Area)
    }

    let faceQueue = new createjs.LoadQueue(false)
    faceQueue.loadManifest(this.manifest)
    faceQueue.on("fileload", (event) => event.item.unit.setupFaceImage(event.result))
    faceQueue.on("complete", (event) => this.delegateLoadMasterComplete(event))
  }

  parseMaster(tag, contents) {
    let id = parseInt(MASTER_PATTERN.exec(tag)[1])
    let name = contents[0]
    let difficulty = contents[1]
    let explanation = contents.slice(2, 5)

    let master = new MasterUnit(id, name, difficulty, explanation)

    this.manifest.push({
      id: tag,
      src: IMAGE_DIR + "Face" + id + ".png",
      unit: master
    })
    this.masters.push(master)
  }

  parseArea(area) {
    this.areaOwner = []

    for(let i in area){
      let line = area[i].split(MULTI_SPACE_PATTERN)
      let parsedLine = line.map(e => parseInt(e)).filter(e => !isNaN(e))
      Array.prototype.push.apply(this.areaOwner, parsedLine)
    }
  }

  getSelectCharacterStage(canvas) {
    this.stage = new SelectCharacterStage(canvas, this.masters)
    return(this.stage)
  }

  delegateLoadComplete() {
    this.parseScenario()
  }

  delegateLoadMasterComplete() {
    console.log("delegateLoadMasterComplete is not implemented yet in:", this)
  }
}
