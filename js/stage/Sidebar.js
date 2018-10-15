const SIDEBAR_WIDTH = 200

class SideBar extends createjs.Container {
  constructor(playerMaster) {
    super()

    this.player = playerMaster

    let background = this.addChild(new createjs.Shape())
    background.graphics.beginFill("darkblue")
      .drawRect(0, 0, SIDEBAR_WIDTH, clientHeight)
  }

 



  setupUnitDetailContainer() {
    


}