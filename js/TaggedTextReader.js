const TAG_PATTERN = /\[(\S+)\]/ // []で囲われた空白以外の文字列
const NEW_LINE_PATTERN = /\n/

class TaggedTextReader {
  constructor(path) {

    this.data = {}
    // this.readText(path)

    let hog = this.readTextFile(path)

    console.log(this.data)
    console.log(hog)
  }

  readText(path) {
    let file = ""
    let reader = new FileReader;

    let currentTag = ""

    while (!file.AtEndOfStream) {
      text = file.ReadLine();
      console.log(text)

      if (TAG_PATTERN.test(text)) {
        if (currentTag !== "") alert("error")
        currentTag = TAG_PATTERN.exec(text)[1]
      } else if (NEW_LINE_PATTERN.test(text))
        currentTag = ""
      else {
        if (this.data[currentTag] === undefined) this.data[currentTag] += text
        else this.data[currentTag] = text
      }
    }
  }

  hoge(path) {
    httpObj = new XMLHttpRequest();
    httpObj.open('GET', fileName + "?" + (new Date()).getTime(), true);
    // ?以降はキャッシュされたファイルではなく、毎回読み込むためのもの
    httpObj.send(null);
    httpObj.onreadystatechange = function() {
      if ((httpObj.readyState == 4) && (httpObj.status == 200)) {
        document.getElementById("text1").value = httpObj.responseText;
      }
    }
  }

  readTextFile(fileName) {
    var reqFile = new XMLHttpRequest();
    reqFile.open('GET', fileName, true);
    reqFile.send(null);
    return reqFile.responseText;
  }

}
