const BATTLE_MAP_SIZE = 32
const MAP_MAX_ADJACENCY = 8
const AREA_PLACEABLE_UNITS = 20

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
    this.readEscapeZoneMap()
  }
  
  readMapLine(i) {
    return(this.getBitArray10(i * BATTLE_MAP_SIZE, (i + 1) * BATTLE_MAP_SIZE - 1))
  }
  readZoneMapLine(i) {
    let mixedLine = this.getBitArray10(i * AREA_PLACEABLE_UNITS * 2, (i + 1) * AREA_PLACEABLE_UNITS * 2 - 1)
    let zones = []
    for (let j = 0; j < AREA_PLACEABLE_UNITS; j++) zones.push({x: mixedLine[j * 2], y: mixedLine[j * 2 + 1]})
    return(zones)
  }

  readBackgroundChipMap() {
    for (let i = 0; i < BATTLE_MAP_SIZE; i++) this.backgroundChipMap.push(this.readMapLine(i))
  }
  readFrontChipMap() {
    this.increseOffset10(32**2)
    for (let i = 0; i < BATTLE_MAP_SIZE; i++) this.frontChipMap.push(this.readMapLine(i))
  }
  readStrategyChipMap() {
    this.increseOffset10(32**2)
    for (let i = 0; i < BATTLE_MAP_SIZE; i++) this.strategyChipMap.push(this.readMapLine(i))
  }
  readHeightMap() {
    this.increseOffset10(32**2)
    for (let i = 0; i < BATTLE_MAP_SIZE; i++) this.heightMap.push(this.readMapLine(i))
  }
  readEscapeZoneMap() {
    this.increseOffset10(32**2)
    for (let i = 0; i < MAP_MAX_ADJACENCY; i ++) this.escapeZoneMap.push(this.readZoneMapLine(i))
  }
}