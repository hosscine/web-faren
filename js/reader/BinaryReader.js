class BinaryReader {
  constructor(data) {
    this.data = new DataView(data)
    this.offset = 0
  }

  getBitArray16(i, j) {
    let start = parseInt(i, 16) + this.offset
    let end = parseInt(j, 16) + this.offset
    let array = []
    for (let k = start; k <= end; k++) array.push(this.data.getUint8(k))
    return array
  }

  getBitArray10(i, j) {
    let start = i + this.offset
    let end = j + this.offset
    let array = []
    for (let k = start; k <= end; k++) array.push(this.data.getUint8(k))
    return array
  }

  getBitNumeric16(i, j) {
    return this.getBitArray16(i, j).reduce((a,x) => a += x, 0)
  }

  getBitNumeric10(i, j) {
    return parseInt(this.getBitHexadecimal10(i, j).reverse().reduce((a,x) => a += x, ""), 16)
    // return this.getBitArray10(i, j).reduce((a,x) => a += x, 0)
  }

  getBitHexadecimal16(i, j) {
    return this.getBitArray16(i, j).map(x => x.toString(16))
  }

  getBitHexadecimal10(i, j) {
    return this.getBitArray10(i, j).map(x => x.toString(16))
  }

  getBitString16(i, j) {
    return UnescapeSJIS(this.getBitArray16(i, j).reduce((a,x) => a += (x !== 0 ? "%" + x.toString(16) : ""), ""))
  }

  getBitString10(i, j) {
    return UnescapeSJIS(this.getBitArray10(i, j).reduce((a,x) => a += (x !== 0 ? "%" + x.toString(16) : ""), ""))
  }

  increseOffset16(i) {
    this.offset += parseInt(i, 16)
  }

  increseOffset10(i) {
    this.offset += i
  }
}
