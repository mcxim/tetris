const cellPx = 20;

const horizontalCells = 10;
const verticalCells = 20;

type Coords = [number, number];

type ColorMatrix = p5.Color[][];

let cells: ColorMatrix = [];
let posCells: Coords[][] = [];
let pos: Coords = [0, 0];

class StickerState {
  constructor(
    public matrix: Booly[][],
    public size: number,
    public coords: Coords,
    public color: p5.Color
  ) {}
}

let stickerState: StickerState;

const emptyColorString = "pink";
const emptyColor = color(emptyColorString);

const possibleColors = [
  "blue",
  "red",
  "green",
  "yellow",
].map((str) => color(str));

function setup() {
  createCanvas(
    cellPx * horizontalCells,
    cellPx * verticalCells
  );
  noStroke();
  strokeWeight(4);
  stroke(51);
  fill(emptyColorString);
  for (var i: number = 0; i < 20; i++) {
    cells[i] = [];
    posCells[i] = [];
    for (var j: number = 0; j < 10; j++) {
      console.log(i, j);
      cells[i][j] = color(emptyColorString);
      posCells[i][j] = [j * cellPx, i * cellPx];
      rect(j * cellPx, i * cellPx, cellPx, cellPx);
    }
  }
  initNewShape();
}

function draw() {
  drawGrid();
}

function drawGrid() {
  strokeWeight(1);
  for (let i = 0; i <= horizontalCells; i++) {
    line(i * cellPx, 0, i * cellPx, height);
  }
}

function rotate(matrix: any[][]) {
  return matrix[0].map((_, colIndex) =>
    matrix.map((row) => row[colIndex]).reverse()
  );
}

function applySticker(): Boolean {
  let size = stickerState.size;
  let matrix = stickerState.matrix;
  let [x, y] = stickerState.coords;
  let stickerColor = stickerState.color;
  for (let i = 0; i < stickerState.size; i++) {
    for (let j = 0; j < size; j++) {
      if (!!matrix[i][j]) {
        if (cells[x + i][y + j] === emptyColor && (0 <= x + i <= horizontalCells - 1) &&) {
          cells[x + i][y + j] = stickerColor;
        } else {
          return false;
        }
      }
    }
  }
  return true;
}

function initNewShape(){
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
  initCoords = [0 + delta, 0]; // x, y

  stickerState = new StickerState(
    shape,
    size,
    initCoords,
    possibleColors[floor(random(0, possibleColors.length))]
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
