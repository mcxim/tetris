type Shape = "J" | "L" | "O" | "T" | "S" | "Z" | "I";
type Booly = 1 | 0;
const shapes: Shape[] = ["J", "L", "O", "T", "S", "Z", "I"];

function generatePolygon(): [Booly[][], number] {
  let p: Booly[][];
  let shape = shapes[floor(random() * 7)];
  let size: number;
  switch (shape) {
    case "I":
      size = 4;
      p = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      break;

    case "O":
      size = 2;
      p = [
        [1, 1],
        [1, 1],
      ];
      break;

    case "J":
      size = 3;
      p = [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ];
      break;

    case "L":
      size = 3;
      p = [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ];
      break;

    case "S":
      size = 3;
      p = [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ];
      break;

    case "Z":
      size = 3;
      p = [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ];
      break;

    case "T":
      size = 3;
      p = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ];
      break;
  }
  return [p, size];
}
