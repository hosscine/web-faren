class Area {
  constructor(data, owner) {
    this.owner = owner
    for (let i in data) this[i] = data[i]
  }
}
