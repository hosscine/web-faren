const CALL_PATTERN = /Call(\d+)/
const CALL_INIT_PATTERN = /Init(\d+)/

class TaggedCallableReader extends TaggedTextReader {
  constructor(text) {
    super(text)

    this.employable = []
    this.initialEmployable = []

    this.parseCallable()
  }

  parseCallable() {
    for (let tag in this.data) {
      if (CALL_PATTERN.test(tag)) this.parseCall(tag, this.data[tag])
      else if (CALL_INIT_PATTERN.test(tag)) this.parseInit(tag, this.data[tag])
      else Error("Callableに不正なタグ", tag, "が使用されています。")
    }
  }

  parseCall(tag, contents) {
    let type = parseInt(CALL_PATTERN.exec(tag)[1])
    if (this.employable.length !== type) Error("CallableのCallの順番がおかしいです。")
    this.employable.push(contents)
  }

  parseInit(tag, contents) {
    let type = parseInt(CALL_INIT_PATTERN.exec(tag)[1])
    if (this.initialEmployable.length !== type) Error("CallableのInitの順番がおかしいです。")
    this.initialEmployable.push(contents)
  }
}
