interface Position {
  x: number;
  y: number;
}

interface Shape {
  id: number;
  position: Position;
  colour: string;
}

/** Command interface */
interface Command {
  execute(): void;
  undo(): void;
}

type CommandType = 'MOVE' | 'DELETE' | 'UPDATE_COLOR';
