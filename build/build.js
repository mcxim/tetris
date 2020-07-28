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
var cells = [];
var posCells = [];
var pos = [0, 0];
var StickerState = (function () {
    function StickerState(matrix, size, coords, color) {
        this.matrix = matrix;
        this.size = size;
        this.coords = coords;
        this.color = color;
    }
    return StickerState;
}());
var stickerState;
var emptyColorString = "pink";
var emptyColor = color(emptyColorString);
var possibleColors = [
    "blue",
    "red",
    "green",
    "yellow",
].map(function (str) { return color(str); });
function setup() {
    createCanvas(cellPx * horizontalCells, cellPx * verticalCells);
    noStroke();
    strokeWeight(4);
    stroke(51);
    fill(emptyColorString);
    for (var i = 0; i < 20; i++) {
        cells[i] = [];
        posCells[i] = [];
        for (var j = 0; j < 10; j++) {
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
    for (var i = 0; i <= horizontalCells; i++) {
        line(i * cellPx, 0, i * cellPx, height);
    }
}
function rotate(matrix) {
    return matrix[0].map(function (_, colIndex) {
        return matrix.map(function (row) { return row[colIndex]; }).reverse();
    });
}
function applySticker() {
    var size = stickerState.size;
    var matrix = stickerState.matrix;
    var _a = stickerState.coords, x = _a[0], y = _a[1];
    var stickerColor = stickerState.color;
    for (var i = 0; i < stickerState.size; i++) {
        for (var j = 0; j < size; j++) {
            if (!!matrix[i][j]) {
                if (cells[x + i][y + j] === emptyColor && (0 <= x + i <= horizontalCells - 1) && ) {
                    cells[x + i][y + j] = stickerColor;
                }
                else {
                    return false;
                }
            }
        }
    }
    return true;
}
function initNewShape() {
    var initCoords = [0, 0];
    var _a = generatePolygon(), shape = _a[0], size = _a[1];
    var leftMost = 0;
    for (var i = size; i > 0; i--) {
        for (var j = 0; j < size; j++) {
            if (shape[j][i] == 1) {
                leftMost = i;
                break;
            }
        }
        break;
    }
    var delta = floor(random() * (horizontalCells - size + leftMost));
    initCoords = [0 + delta, 0];
    stickerState = new StickerState(shape, size, initCoords, possibleColors[floor(random(0, possibleColors.length))]);
}
function keyPressed() {
    if (keyCode === UP_ARROW) {
        stickerState.matrix = rotate(stickerState.matrix);
    }
    else if (keyCode === DOWN_ARROW) {
        stickerState.coords = [
            stickerState.coords[0],
            stickerState.coords[1] + 1,
        ];
    }
    applySticker();
}
//# sourceMappingURL=build.js.map