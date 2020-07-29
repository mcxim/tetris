const cellPx = 20;

const horizontalCells = 10;
const verticalCells = 20;

type Coords = [number, number];

type ColorString =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "orange"
  | "white"
  | "pink";
type ColorMatrix = ColorString[][];

let cells: ColorMatrix = [];
let posCells: Coords[][] = [];
let pos: Coords = [0, 0];

class StickerState {
  constructor(
    public matrix: Booly[][],
    public size: number,
    public coords: Coords,
    public colorString: ColorString
  ) {}
}

let stickerState: StickerState;

const emptyColorString = "white";
let emptyColor: p5.Color;

function setup() {
  createCanvas(
    cellPx * horizontalCells,
    cellPx * verticalCells
  );
  emptyColor = color(emptyColorString);
  const possibleColors: ColorString[] = [
    "blue",
    "red",
    "green",
    "yellow",
    "purple",
    "orange",
  ];
  initNewShape(possibleColors);
  strokeWeight(4);
  stroke(51);
  fill(emptyColorString);
  for (let i = 0; i < verticalCells; i++) {
    cells[i] = [];
    posCells[i] = [];
    for (let j = 0; j < horizontalCells; j++) {
      cells[i][j] = emptyColorString;
      posCells[i][j] = [j * cellPx, i * cellPx];
    }
  }
  console.log(applySticker());
}

function draw() {
  drawGrid();
}

function drawGrid() {
  push();
  for (let i = 0; i < verticalCells; i++) {
    for (let j = 0; j < horizontalCells; j++) {
      fill(cells[i][j]);
      rect(j * cellPx, i * cellPx, cellPx, cellPx);
    }
  }
  pop();
}

function rotate(matrix: any[][]) {
  return matrix[0].map((_, colIndex) =>
    matrix.map((row) => row[colIndex]).reverse()
  );
}

function applySticker(): Boolean {
  let size = stickerState.size;
  let matrix = stickerState.matrix;
  let [y, x] = stickerState.coords;
  let stickerColor = stickerState.colorString;
  for (let ySticker = 0; ySticker < size; ySticker++) {
    for (let xSticker = 0; xSticker < size; xSticker++) {
      if (!!matrix[ySticker][xSticker]) {
        if (
          cells[y + ySticker][x + xSticker] ===
            emptyColorString &&
          0 <= x + xSticker &&
          x + xSticker <= horizontalCells - 1 &&
          0 <= y + ySticker &&
          y + ySticker <= verticalCells - 1
        ) {
          cells[y + ySticker][x + xSticker] = stickerColor;
        } else {
          return false;
        }
      }
    }
  }
  return true;
}

function initNewShape(colors: ColorString[]) {
  let initCoords: Coords = [0, 0];
  let [shape, size] = generatePolygon();

  let leftMost = 0;
  //Check leftShape
  for (let i = size; i > 0; i--) {
    //Column--------------[?][i]
    //Check what is the leftmost filled cell of the shape
    //Checks column whise
    for (let j = 0; j < size; j++) {
      //Row-------------[j][i]
      if (shape[j][i] == 1) {
        leftMost = i;
        break;
      }
    }
    break;
  }

  let delta = floor(
    random() * (horizontalCells - size + leftMost)
  );
  initCoords = [0, 0 + delta]; // y, x

  stickerState = new StickerState(
    shape,
    size,
    initCoords,
    colors[floor(random(0, colors.length))]
  );
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    stickerState.matrix = rotate(stickerState.matrix);
  } else if (keyCode === DOWN_ARROW) {
    stickerState.coords = [
      stickerState.coords[0],
      stickerState.coords[1] + 1,
    ];
  }
  applySticker();
}
