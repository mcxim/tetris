var shapes = ["J", "L", "O", "T", "S", "Z", "I"];
function generatePolygon() {
    var p;
    var shape = shapes[floor(random() * 7)];
    var size;
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
var cellPx = 20;
var horizontalCells = 10;
var verticalCells = 20;
var timeStep = 1000;
var possibleColors = [
    "blue",
    "red",
    "green",
    "yellow",
    "purple",
    "orange",
];
var cells = [];
var steadyStateCells = [];
var lastFrame = [];
var posCells = [];
var pos = [0, 0];
var StickerState = (function () {
    function StickerState(matrix, size, coords, colorString) {
        this.matrix = matrix;
        this.size = size;
        this.coords = coords;
        this.colorString = colorString;
    }
    return StickerState;
}());
var stickerState;
var emptyColorString = "white";
var emptyColor;
function setup() {
    createCanvas(cellPx * horizontalCells, cellPx * verticalCells);
    emptyColor = color(emptyColorString);
    console.log(steadyStateCells);
    strokeWeight(4);
    stroke(51);
    fill(emptyColorString);
    for (var i = 0; i < verticalCells; i++) {
        cells[i] = [];
        posCells[i] = [];
        for (var j = 0; j < horizontalCells; j++) {
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
    for (var i = 0; i < verticalCells; i++) {
        for (var j = 0; j < horizontalCells; j++) {
            fill(cells[i][j]);
            rect(j * cellPx, i * cellPx, cellPx, cellPx);
        }
    }
    pop();
}
function rotateMatrix(matrix) {
    return matrix[0].map(function (_, colIndex) {
        return matrix.map(function (row) { return row[colIndex]; }).reverse();
    });
}
function applySticker() {
    cells = JSON.parse(JSON.stringify(steadyStateCells));
    var size = stickerState.size;
    var matrix = stickerState.matrix;
    var _a = stickerState.coords, y = _a[0], x = _a[1];
    var stickerColor = stickerState.colorString;
    for (var ySticker = 0; ySticker < size; ySticker++) {
        for (var xSticker = 0; xSticker < size; xSticker++) {
            console.log(ySticker, xSticker, JSON.stringify(matrix));
            if (!!matrix[ySticker][xSticker]) {
                if (cells[y + ySticker][x + xSticker] ===
                    emptyColorString &&
                    0 <= x + xSticker &&
                    x + xSticker <= horizontalCells - 1 &&
                    0 <= y + ySticker &&
                    y + ySticker <= verticalCells - 1) {
                    lastFrame = JSON.parse(JSON.stringify(cells));
                    cells[y + ySticker][x + xSticker] = stickerColor;
                }
                else {
                    console.log("Du und ich sind falsch");
                    cells = JSON.parse(JSON.stringify(lastFrame));
                    return false;
                }
            }
        }
    }
    return true;
}
function initNewShape(colors) {
    steadyStateCells = JSON.parse(JSON.stringify(cells));
    var initCoords = [0, 0];
    var _a = generatePolygon(), shape = _a[0], size = _a[1];
    console.log("before: ", shape);
    var rotations = floor(random(0, 4));
    for (var i = 0; i < rotations; i++) {
        shape = rotateMatrix(shape);
    }
    console.log("after: ", shape);
    var leftMost = 0;
    leftMost = getLeftMost(shape, size);
    var delta = floor(random(0, horizontalCells - leftMost - 1 + 1));
    initCoords = [0, 0 + delta];
    stickerState = new StickerState(shape, size, initCoords, colors[floor(random(0, colors.length))]);
}
function keyPressed() {
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
}
function timeIt() {
    stickerState.coords = [
        stickerState.coords[0] + 1,
        stickerState.coords[1],
    ];
    if (!applySticker()) {
        stickerState.coords = [
            stickerState.coords[0] - 1,
            stickerState.coords[1],
        ];
        initNewShape(possibleColors);
    }
    console.log("tick");
}
function getLeftMost(shape, size) {
    var leftMost = 0;
    for (var i = size - 1; i >= 0; i--) {
        for (var j = 0; j < size; j++) {
            if (shape[j][i] == 1) {
                leftMost = i;
                return leftMost;
            }
        }
    }
}
//# sourceMappingURL=build.js.map