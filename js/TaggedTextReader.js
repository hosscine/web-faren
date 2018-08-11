const TAG_PATTERN = /\[(\S+)\]/
const NEW_LINE_PATTERN = /\n/

class TaggedTextReader {
  constructor(path) {

    this.data = {}

    console.log(this.data)

  }

  readText(path) {
    let fs = new ActiveXObject("Scripting.FileSystemObject");
    let file = fs.OpenTextFile(path);

    let currentTag = ""

    while (!file.AtEndOfStream) {
      text = file.ReadLine();
      console.log(text)

      if(TAG_PATTERN.test(text))
        currentTag = TAG_PATTERN.exec(text)[1]
      else if(NEW_LINE_PATTERN.test(text))
       currentTag = ""
      else {
        if (this.data[currentTag] === undefined) this.data[currentTag] += text
        else this.data[currentTag] = text
      }
    }
  }

}
