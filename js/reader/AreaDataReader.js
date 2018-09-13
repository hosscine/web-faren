const MULTI_SPACE_PATTERN = /\s+/

class AreaDataReader {
  constructor(areadata) {
    this.text = areadata.split(NEW_LINE_PATTERN)

    this.data = []
    this.parseAreaData()
  }

  parseAreaData() {
    for (let i in this.text) {
      let line = this.text[i].split(MULTI_SPACE_PATTERN)
      if (line[0] === "End") break
      let adjacency = line.slice(10, 18).map(e => parseInt(e))

      this.data[i] = {}
      this.data[i].name = line[0]
      this.data[i].type = parseInt(line[1])
      this.data[i].basicIncome = parseInt(line[2])
      this.data[i].maxCity = parseInt(line[3])
      this.data[i].maxWall = parseInt(line[4])
      this.data[i].maxRoad = parseInt(line[5])
      this.data[i].guardsMagnification = parseInt(line[6])
      this.data[i].initialWall = parseInt(line[7])
      this.data[i].x = parseInt(line[8])
      this.data[i].y = parseInt(line[9])
      this.data[i].adjacency = adjacency.slice(0, adjacency.indexOf(0))
      this.data[i].bgm = line[18]
    }
  }

}
