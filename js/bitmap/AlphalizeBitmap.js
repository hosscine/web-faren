class AlphalizeBitmap extends createjs.BitmapData {
  constructor(imageOrUri) {
    super(imageOrUri)

    this.setupAlphaChannel()
  }

  setupAlphaChannel() {
    for (var i = 0; i < this.width; i++)
      for (var j = 0; j < this.height; j++)
        if (this.getPixel(i, j) === 0) this.setPixel32(i, j, 0x00000000)
    this.updateContext()
  }

  setupAlphaChannel2() {
    console.time("hoge")

    let _bmd01 = this;
    var source = _bmd01;
    var halfW = _bmd01.width >> 1;
    var sourceRect = new createjs.Rectangle(halfW, 0, halfW, _bmd01.height);
    var destPoint = new createjs.Point(sourceRect.x, sourceRect.y);
    var operation = "<";
    var threshold = 0xFF110000;
    var color = 0x00000000;
    var mask = 0xFF110000;
    var copySource = false;
    _bmd01.threshold(source, sourceRect, destPoint, operation, threshold, color, mask, copySource);


    // this.threshold(this, new createjs.Rectangle(0, 0, this.width, this.height),
    //   new createjs.Point(50, 50), "==", 4278190080, parseInt(0x00000000)
    // )

    //
    // this.threshold({
    //   source: this,
    //   sourceRect: sourceRect,
    //   destPoint: new createjs.Point(0, 0),
    //   operation: "==",
    //   threshold: 0xFF000000,
    //   color: 0x00000000
    // })
    this.updateContext()
    console.timeEnd("hoge")
  }
}
