const TAG_PATTERN = /\[(\S+)\]/ // []で囲われた空白以外の文字列
const NEW_LINE_PATTERN = /\n/

class TaggedTextReader {
  constructor(path) {
    this.data = {}
    this.text
    this.filepath = path

    this.readFile(path)
  }

  readFile(path) {
    let queue = new createjs.LoadQueue(true)
    queue.on("fileload", (event) => this.formatTaggedText(event.result))
    queue.on("complete", (event) => this.delegateScenarioComplete())
    queue.loadFile(path)
    queue.load()
  }

  formatTaggedText(rawtext) {
    this.text = rawtext.split(NEW_LINE_PATTERN)

    let currentTag = ""
    let contentsStart = 0

    for (let i in this.text) {

      let text = this.text[i]

      if (TAG_PATTERN.test(text)) { // タグかどうか
        if (currentTag !== "") alert(this.filepath + " " + (parseInt(i) + 1) + "行目でタグが連続して出現しています")
        currentTag = TAG_PATTERN.exec(text)[1]
        contentsStart = parseInt(i) + 1
      } else if (text === this.text[2]) { // 空行かどうか this.text[2]が空行だと仮定
        this.data[currentTag] = this.text.slice(contentsStart, parseInt(i)) // コンテンツ登録
        currentTag = ""
      }

    }
  }

  delegateScenarioComplete(){
    console.log("delegateScenarioComplete is not implemented yet in:", this)
  }

}
