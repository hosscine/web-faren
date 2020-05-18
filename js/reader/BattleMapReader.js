const MAP_SIZE = 32

class BattleMapReader extends BinaryReader {
  constructor(data) {
    super(data)

    this.backgroundChipMap = []
    this.frontChipMap = []
    this.strategyChipMap = []
    this.heightMap = []
    this.escapeZoneMap = []

    this.setup()
  }

  setup() {
    this.readBackgroundChipMap()
    this.readFrontChipMap()
    this.readStrategyChipMap()
    this.readHeightMap()
  }
  
  readMapLine(i) {
    return(this.getBitArray10(i * MAP_SIZE, (i + 1) * MAP_SIZE - 1))
  }

  readBackgroundChipMap() {
    for (let i = 0; i < MAP_SIZE; i++) this.backgroundChipMap.push(this.readMapLine(i))
  }
  readFrontChipMap() {
    this.increseOffset10(32**2)
    for (let i = 0; i < MAP_SIZE; i++) this.frontChipMap.push(this.readMapLine(i))
  }
  readStrategyChipMap() {
    this.increseOffset10(32**2)
    for (let i = 0; i < MAP_SIZE; i++) this.strategyChipMap.push(this.readMapLine(i))
  }
  readHeightMap() {
    this.increseOffset10(32**2)
    for (let i = 0; i < MAP_SIZE; i++) this.heightMap.push(this.readMapLine(i))
  }
}