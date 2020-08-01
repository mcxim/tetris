const cellPx = 20;

const horizontalCells = 10;
const verticalCells = 20;
const timeStep = 1000;

type Coords = [number, number];

type ColorString =
  | "red"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "white"
  | "pink";
type ColorMatrix = ColorString[][];
const possibleColors: ColorString[] = [
  "blue",
  "red",
  "green",
  "purple",
  "orange",
];

let cells: ColorMatrix = [];
let steadyStateCells: ColorMatrix = [];
let lastFrame: ColorMatrix = [];
let posCells: Coords[][] = [];
let pos: Coords = [0, 0];
let canMove: Boolean = true;

class StickerState {
  constructor(
    public matrix: Booly[][],
    public size: number,
    public coords: Coords,
    public colorString: ColorString
  ) {}
}

let stickerState: StickerState;

const emptyColorString: ColorString = "white";
let emptyColor: p5.Color;

function setup() {
  createCanvas(
    cellPx * horizontalCells,
    cellPx * verticalCells
  );
  emptyColor = color(emptyColorString);

  console.log(steadyStateCells);
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

  setInterval(timeIt, timeStep);
  console.log(cells);
  initNewShape(possibleColors);
  console.log(steadyStateCells);
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

function rotateMatrix(matrix: Booly[][]): Booly[][] {
  return matrix[0].map((_, colIndex) =>
    matrix.map((row) => row[colIndex]).reverse()
  );
}

function applySticker(): Boolean {
  canMove = true;
  lastFrame = JSON.parse(JSON.stringify(cells));
  cells = JSON.parse(JSON.stringify(steadyStateCells));
  let size = stickerState.size;
  let matrix = stickerState.matrix;
  let [y, x] = stickerState.coords;
  let stickerColor = stickerState.colorString;
  for (let ySticker = 0; ySticker < size; ySticker++) {
    for (let xSticker = 0; xSticker < size; xSticker++) {
      console.log(
        ySticker,
        xSticker,
        JSON.stringify(matrix)
      );
      if (!!matrix[ySticker][xSticker]) {
        try {
          if (
            cells[y + ySticker][x + xSticker] ===
              emptyColorString &&
            0 <= x + xSticker &&
            x + xSticker <= horizontalCells - 1 &&
            0 <= y + ySticker &&
            y + ySticker <= verticalCells - 1
          ) {
            cells[y + ySticker][
              x + xSticker
            ] = stickerColor;
          } else {
            console.log("Du und ich sind falsch");
            cells = JSON.parse(JSON.stringify(lastFrame));
            canMove = !(
              x + xSticker < 0 ||
              x + xSticker >= horizontalCells
            );
            return false;
          }
        } catch {
          console.log("Du und ich sind falsch");
          cells = JSON.parse(JSON.stringify(lastFrame));
          canMove = !(
            x + xSticker < 0 ||
            x + xSticker >= horizontalCells
          );
          return false;
        }
      }
    }
  }
  return true;
}

function moveSticker(xy: Coords) {
  stickerState.coords = xy;
  cells[xy[0]][xy[1]] = stickerState.colorString;
}

function initNewShape(colors: ColorString[]) {
  steadyStateCells = JSON.parse(JSON.stringify(cells));
  let initCoords: Coords = [0, 0];
  let [shape, size] = generatePolygon();

  let rotations = floor(random(0, 4));
  for (let i = 0; i < rotations; i++) {
    shape = rotateMatrix(shape);
  }

  let leftMost = 0;
  leftMost = getLeftMost(shape, size);
  let delta = floor(
    random(0, horizontalCells - leftMost - 1 + 1)
  );
  //console.log(leftMost);
  //let delta = horizontalCells - leftMost - 1;
  initCoords = [0, 0 + delta]; // y, x

  stickerState = new StickerState(
    shape,
    size,
    initCoords,
    colors[floor(random(0, colors.length))]
  );
}

function keyPressed() {
  let lastCoords: Coords = [
    stickerState.coords[0],
    stickerState.coords[1],
  ];
  if (keyCode === UP_ARROW) {
    stickerState.matrix = rotateMatrix(stickerState.matrix);
  } else if (keyCode === DOWN_ARROW) {
    stickerState.coords = [
      stickerState.coords[0] + 1,
      stickerState.coords[1],
    ];
  } else if (keyCode === RIGHT_ARROW) {
    stickerState.coords = [
      stickerState.coords[0],
      stickerState.coords[1] + 1,
    ];
  } else if (keyCode === LEFT_ARROW) {
    stickerState.coords = [
      stickerState.coords[0],
      stickerState.coords[1] - 1,
    ];
  }
  applySticker();
  if (!canMove) stickerState.coords = lastCoords;
}

function removeLineIfPossible() {
  let done = false;
  while (!done) {
    let fullLineIdx = steadyStateCells.findIndex(
      (line: ColorString[]) =>
        line.every((cell) => cell != emptyColorString)
    );
    if (fullLineIdx == -1) done = true;
    else {
      steadyStateCells.splice(fullLineIdx, 1);
      steadyStateCells = ([
        Array(horizontalCells).fill(emptyColorString),
      ] as ColorMatrix).concat(steadyStateCells);
    }
  }
}

function timeIt() {
  // 1 time step = 1000 millisecond
  stickerState.coords = [
    stickerState.coords[0] + 1,
    stickerState.coords[1],
  ];
  if (!applySticker()) {
    console.log("Falsch");
    cells = JSON.parse(JSON.stringify(lastFrame));
    initNewShape(possibleColors);
  }
  removeLineIfPossible();
  console.log("tick");
}

function getLeftMost(shape: Booly[][], size: number) {
  let leftMost = 0;
  for (let i = size - 1; i >= 0; i--) {
    //-----[?][i]
    for (let j = 0; j < size; j++) {
      //-----[j][i]
      if (shape[j][i] == 1) {
        leftMost = i;
        return leftMost;
      }
    }
  }
}
