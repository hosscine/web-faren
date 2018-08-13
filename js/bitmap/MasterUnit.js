class MasterUnit extends Unit {
  constructor(id, name, difficulty, explanation) {
    super(id, name)

    this.difficulty = difficulty
    this.explanation = explanation
  }

  setup(faceBitmap, unitBitmap) {
    this.faceBitmap = faceBitmap
    this.unitBitmap = unitBitmap
  }

}
