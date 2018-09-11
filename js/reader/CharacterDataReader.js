const CHARACTER_DATA_HEADER_LENGTH = 544
const CHARACTER_DATA = {
  name: 21,
  magic: {
    fire: 1,
    aqua: 1,
    wind: 1,
    earth: 1,
    light: 1,
    dark: 1
  },
  resist: {
    physical: 1,
    poison: 1,
    stone: 1,
    paralyze: 1,
    sleep: 1,
    illusion: 1,
    death: 1,
    absorb: 1,
    holy: 1,
    fire: 1,
    aqua: 1,
    wind: 1,
    earth: 1,
    light: 1,
    dark: 1
  },
  characterType: {
    named: 1,
    wander: 1,
    legendary: 1,
    _special: 1
  },
  species: 2,
  cost: 2,
  standard: {
    moveType: 2,
    moveRange: 2,
    HP: 2,
    MP: 2,
    physicalStrength: 2,
    physicalResistance: 2,
    technique: 2,
    agility: 2,
    magicalStrength: 2,
    magicalResistance: 2,
    passion: 2,
    braveness: 2,
    HPrecover: 2,
    MPrecover: 2
  },
  uniqueSkill: {
    skillID: 2,
    skillTimes: 2
  },
  heroChar: 1,
  higherClass: 2,
  experience: 2,
  wanderingTurn: {
    appearTurn: 2,
    disappearTurn: 2
  },
  helpID: 2,
  howToAttack: {
    type1st: 2,
    type2nd: 2,
    type3rd: 2,
    type4th: 2,
    type5th: 2,
    power1st: 2,
    power2nd: 2,
    power3rd: 2,
    power4th: 2,
    power5th: 2
  },
  employable: {
    ID1: 2,
    ID2: 2,
    ID3: 2,
    ID4: 2,
    ID5: 2,
    ID6: 2,
    ID7: 2,
    ID8: 2
  },
  undefined1: 16,
  beastTamer: 1,
  useDefault: {
    special: 1,
    unitImage: 1,
    flagImage: 1,
    faceImage: 1
  },
  undefined2: 1,
  unitImageID: 2,
  undefined3: 2,
  faceImageID: 2,
  undefined4: 2,
  flagImageID: 2,
  undefined5: 2,
  undefined6: 31,
  isUndead: 1,
  undefined7: 129
}

class CharacterDataReader extends BinaryReader {
  constructor(data) {
    super(data)

    this.characters = []
    this.imageManifest = []

    this.havingUnit = {}
    this.havingFace = {}
    this.havingFlag = {}

    this.setup()
  }

  setup() {
    this.increseOffset16(CHARACTER_DATA_HEADER_LENGTH)

    while (this.offset + 324 <= this.data.byteLength) this.parseCharacter()

    this.setupImageManifest()
  }

  setupImageManifest() {
    for (let i in this.havingUnit) this.imageManifest.push({
      id: "unit" + i,
      src: IMAGE_DIR + "Char" + i + ".png",
      index: i
    })

    for (let i in this.havingFace) this.imageManifest.push({
      id: "face" + i,
      src: IMAGE_DIR + "Face" + i + ".png",
      index: i
    })

    for (let i in this.havingFlag) this.imageManifest.push({
      id: "flag" + i,
      src: IMAGE_DIR + "Flag" + i + ".png",
      index: i
    })
  }

  parseCharacter() {
    let i = 0
    let cdata = {}

    for (let key in CHARACTER_DATA) {
      // if       名前ならstringにして格納
      // else if  howToAttackのようなグループ化されたデータはgetDataByHashを使う
      // else     単体のデータはgetDataByKeyを使う
      if (key === "name") cdata.name = this.getBitString10(0, (i += CHARACTER_DATA.name) - 1)
      else if (typeof CHARACTER_DATA[key] === "object")
        [cdata[key], i] = this.getDataByHash(CHARACTER_DATA[key], i)
      else
        [cdata[key], i] = this.getDataByKey(key, i)
    }

    this.characters.push(cdata)
    this.increseOffset10(i)

    // 読み込む必要のある画像をピックアップ
    if (cdata.unitImageID !== 0) this.havingUnit[cdata.unitImageID] = 0
    if (cdata.faceImageID !== 0) this.havingFace[cdata.faceImageID] = 0
    if (cdata.flagImageID !== 0) this.havingFlag[cdata.flagImageID] = 0
  }

  getDataByKey(key, start) {
    return [this.getBitNumeric10(start, (start += CHARACTER_DATA[key]) - 1), start]
  }

  getDataByHash(hash, start) {
    let data = {}
    for (let key in hash) data[key] = this.getBitNumeric10(start, (start += hash[key]) - 1)
    return [data, start]
  }
}
