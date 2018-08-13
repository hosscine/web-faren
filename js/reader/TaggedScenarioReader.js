const MASTER_PATTERN = /Master(\d+)/

class TaggedScenarioReader extends TaggedTextReader {
  constructor(path) {
    super(path)
  }

  handleComplete() {
    this.parseScenario()
  }

  parseScenario(){
    for(let tag in this.data){
      if(MASTER_PATTERN.test(tag)) this.parseMaster(tag, this.data[tag])
    }

  }

  parseMaster(tag, contents){
    let id = MASTER_PATTERN.exec(tag)[1]
    let name = contents[0]
    let difficulty = contents[1]
    let explanation = contents.slice(2,4)
  }

  getSelectCharacterStage(){

  }

}
