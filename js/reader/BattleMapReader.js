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

    // // 一応下記で街、壁、道を取り出せる
    // console.log(this.getBitNumeric10(0, 3))
    // this.increseOffset10(4)
    // console.log(this.getBitNumeric10(0, 3))
    // this.increseOffset10(4)
    // console.log(this.getBitNumeric10(0, 3))
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
    this.increseOffset10(BATTLE_MAP_SIZE**2)
  }
  readFrontChipMap() {
    for (let i = 0; i < BATTLE_MAP_SIZE; i++) this.frontChipMap.push(this.readMapLine(i))
    this.increseOffset10(BATTLE_MAP_SIZE**2)
  }
  readStrategyChipMap() {
    for (let i = 0; i < BATTLE_MAP_SIZE; i++) this.strategyChipMap.push(this.readMapLine(i))
    this.increseOffset10(BATTLE_MAP_SIZE**2)
  }
  readHeightMap() {
    for (let i = 0; i < BATTLE_MAP_SIZE; i++) this.heightMap.push(this.readMapLine(i))
    this.increseOffset10(BATTLE_MAP_SIZE**2)
  }
  readEscapeZoneMap() {
    for (let i = 0; i < MAP_MAX_ADJACENCY; i ++) this.escapeZoneMap.push(this.readZoneMapLine(i))
    this.increseOffset10(AREA_PLACEABLE_UNITS * 2 * MAP_MAX_ADJACENCY)
  }
}