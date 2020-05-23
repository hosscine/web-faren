class BattleMap extends ScrollContainer {
  constructor(data) {
    super()
    this.data = data
    this.setup()
  }

  setup() {
    // this.drewBackgroundMap = JSON.parse(JSON.stringify(this.data.backgroundMap))

    this.setupMap(this.data.backgroundChipMap, assets.backgroundChips)
    let bounds = this.mapContainer.getBounds()
    this.setContentBounds(bounds.width, bounds.height)
    

    // // マップ全体をキャッシュ
    // this.cache(this.x, this.y, bounds.width, bounds.height)
    // createjs.Tween.get(this, { loop: -1 })
    //   .wait(FLAG_MOTION_INTERVAL)
    //   .call(() => this.updateCache())
  }

  setupMap(mapData, mapChips) {
    this.mapContainer = this.addChild(new createjs.Container())
    const HALF_CHIP_SIZE = MINI_CHIP_SIZE / 2
    
    for (let i = 0; i < mapData.length; i++) {
      for (let j = 0; j < mapData[i].length; j++) {
        let chip = this.mapContainer.addChild(mapChips.getChip(mapData[i][j]))
        // 奇数行は半マスずらして疑似ヘックスマップにする
        chip.x = i * MINI_CHIP_SIZE + (j%2 ? HALF_CHIP_SIZE : 0)
        chip.y = j * MINI_CHIP_SIZE
      }
    }
  }

}