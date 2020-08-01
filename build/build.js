const shapes = ["J", "L", "O", "T", "S", "Z", "I"];
function generatePolygon() {
    let p;
    let shape = shapes[floor(random() * 7)];
    let size;
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
const cellPx = 20;
const horizontalCells = 10;
const verticalCells = 20;
const timeStep = 1000;
const possibleColors = [
    "blue",
    "red",
    "green",
    "yellow",
    "purple",
    "orange",
];
let cells = [];
let steadyStateCells = [];
let lastFrame = [];
let posCells = [];
let pos = [0, 0];
let canMove = true;
class StickerState {
    constructor(matrix, size, coords, colorString) {
        this.matrix = matrix;
        this.size = size;
        this.coords = coords;
        this.colorString = colorString;
    }
}
let stickerState;
const emptyColorString = "white";
let emptyColor;
function setup() {
    createCanvas(cellPx * horizontalCells, cellPx * verticalCells);
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
function rotateMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]).reverse());
}
function applySticker() {
    canMove = true;
    lastFrame = JSON.parse(JSON.stringify(cells));
    cells = JSON.parse(JSON.stringify(steadyStateCells));
    let size = stickerState.size;
    let matrix = stickerState.matrix;
    let [y, x] = stickerState.coords;
    let stickerColor = stickerState.colorString;
    for (let ySticker = 0; ySticker < size; ySticker++) {
        for (let xSticker = 0; xSticker < size; xSticker++) {
            console.log(ySticker, xSticker, JSON.stringify(matrix));
            if (!!matrix[ySticker][xSticker]) {
                try {
                    if (cells[y + ySticker][x + xSticker] ===
                        emptyColorString &&
                        0 <= x + xSticker &&
                        x + xSticker <= horizontalCells - 1 &&
                        0 <= y + ySticker &&
                        y + ySticker <= verticalCells - 1) {
                        cells[y + ySticker][x + xSticker] = stickerColor;
                    }
                    else {
                        console.log("Du und ich sind falsch");
                        cells = JSON.parse(JSON.stringify(lastFrame));
                        canMove = !(x + xSticker < 0 ||
                            x + xSticker >= horizontalCells);
                        return false;
                    }
                }
                catch (_a) {
                    console.log("Du und ich sind falsch");
                    cells = JSON.parse(JSON.stringify(lastFrame));
                    canMove = !(x + xSticker < 0 ||
                        x + xSticker >= horizontalCells);
                    return false;
                }
            }
        }
    }
    return true;
}
function moveSticker(xy) {
    stickerState.coords = xy;
    cells[xy[0]][xy[1]] = stickerState.colorString;
}
function initNewShape(colors) {
    steadyStateCells = JSON.parse(JSON.stringify(cells));
    let initCoords = [0, 0];
    let [shape, size] = generatePolygon();
    let rotations = floor(random(0, 4));
    for (let i = 0; i < rotations; i++) {
        shape = rotateMatrix(shape);
    }
    let leftMost = 0;
    leftMost = getLeftMost(shape, size);
    let delta = floor(random(0, horizontalCells - leftMost - 1 + 1));
    initCoords = [0, 0 + delta];
    stickerState = new StickerState(shape, size, initCoords, colors[floor(random(0, colors.length))]);
}
function keyPressed() {
    let lastCoords = [
        stickerState.coords[0],
        stickerState.coords[1],
    ];
    if (keyCode === UP_ARROW) {
        stickerState.matrix = rotateMatrix(stickerState.matrix);
    }
    else if (keyCode === DOWN_ARROW) {
        stickerState.coords = [
            stickerState.coords[0] + 1,
            stickerState.coords[1],
        ];
    }
    else if (keyCode === RIGHT_ARROW) {
        stickerState.coords = [
            stickerState.coords[0],
            stickerState.coords[1] + 1,
        ];
    }
    else if (keyCode === LEFT_ARROW) {
        stickerState.coords = [
            stickerState.coords[0],
            stickerState.coords[1] - 1,
        ];
    }
    applySticker();
    if (!canMove)
        stickerState.coords = lastCoords;
}
function removeLineIfPossible() {
    let done = false;
    while (!done) {
        let fullLineIdx = steadyStateCells.findIndex((line) => line.every((cell) => cell != emptyColorString));
        if (fullLineIdx == -1)
            done = true;
        else {
            steadyStateCells.splice(fullLineIdx, 1);
            steadyStateCells = [
                Array(horizontalCells).fill(emptyColorString),
            ].concat(steadyStateCells);
        }
    }
}
function timeIt() {
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
function getLeftMost(shape, size) {
    let leftMost = 0;
    for (let i = size - 1; i >= 0; i--) {
        for (let j = 0; j < size; j++) {
            if (shape[j][i] == 1) {
                leftMost = i;
                return leftMost;
            }
        }
    }
}
//# sourceMappingURL=build.js.map