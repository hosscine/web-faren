const TAG_PATTERN = /\[(\S+)\]/ // []で囲われた空白以外の文字列
const NEW_LINE_PATTERN = /\r\n|\r|\n/

class TaggedTextReader {
  constructor(text) {
    this.text = text
    this.data = {}
    
    this.formatTaggedText(text)
  }


  readFile(path) {
    let queue = new createjs.LoadQueue(true)
    queue.on("fileload", (event) => this.formatTaggedText(event.result))
    queue.on("complete", (event) => this.delegateLoadComplete())
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
      } else if (text === "") { // 空行かどうか this.text[2]が空行だと仮定
        this.data[currentTag] = this.text.slice(contentsStart, parseInt(i)) // コンテンツ登録
        currentTag = ""
      }

    }
  }

  delegateLoadComplete() {
    console.log("delegateLoadComplete is not implemented yet in:", this)
  }

}
