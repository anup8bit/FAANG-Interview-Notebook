class MoveCommand implements Command {
  constructor (
    private shape: Shape,
    private toPos: Position,
    private fromPos: Position
  ) {}

  execute(): void {
      this.shape.position = this.toPos;
  }

  undo(): void {
      this.shape.position = this.toPos;
  }
}