const cellPx = 20;

const horizontalCells = 10;
const verticalCells = 20;

type Coords = [number, number];

type ColorMatrix = p5.Color[][];

let cells: ColorMatrix = [];
let posCells: Coords[][] = [];
let pos: Coords = [0, 0];

let global;

const emptyColorString = "pink";
const emptyColor = color(emptyColorString);

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

function applySticker(
  sticker: Booly[][],
  size: number,
  cells: ColorMatrix,
  [x, y]: Coords,
  stickerColor = p5.Color
): Boolean {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!!sticker[i][j]) {
        if (cells[x + i][y + j] === emptyColor) {
          cells[x + i][y + j] = new stickerColor();
        } else {
          return false;
        }
      }
    }
  }
  return true;
}

function initNewShape(): [Booly[][], Coords] {
  let initCoords: Coords = [0, 0];
  let [shape, size] = generatePolygon();
  let delta = floor(random() * (horizontalCells - size));
  initCoords = [0 + delta, 0]; // x, y
  shape = rotate(shape);
  return [shape, initCoords];
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    rotate();
  } else if (keyCode === DOWN_ARROW) {
    value = 0;
  }
}
