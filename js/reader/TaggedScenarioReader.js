const MASTER_PATTERN = /Master(\d+)/

class TaggedScenarioReader extends TaggedTextReader {
  constructor(text) {
    super(text)

    this.masters = []
    this.areaOwner = []
    this.initialLocation = []

    this.parseScenario()
  }

  parseScenario() {
    for (let tag in this.data) {
      if (MASTER_PATTERN.test(tag)) this.parseMaster(tag, this.data[tag])
      else if (tag === "Area") this.parseArea(this.data.Area)
      else if (tag === "Locate") this.parseLocate(this.data.Locate)
    }
  }

  parseMaster(tag, contents) {
    let id = parseInt(MASTER_PATTERN.exec(tag)[1])
    let name = contents[0]
    let difficulty = contents[1]
    let explanation = contents.slice(2, 5)

    // このときマスターのIDは数字になっている
    // MasterUnit.setup(assets) 呼び出し時に一般ユニット同様ユニット名のIDが指定される
    let master = new MasterUnit(id, name, difficulty, explanation)
    this.masters.push(master)
  }

  parseArea(area) {
    for (let i in area) {
      let line = area[i].split(MULTI_SPACE_PATTERN)
      let parsedLine = line.map(e => parseInt(e)).filter(e => !isNaN(e))
      Array.prototype.push.apply(this.areaOwner, parsedLine)
    }
  }

  parseLocate(locate) {
    for (let lc of locate) {
      let line = lc.split(MULTI_SPACE_PATTERN)
      this.initialLocation.push({
        unitID: line[0],
        areaID: parseInt(line[1]),
        unitRank: parseInt(line[2])
      })
    }
  }
}
