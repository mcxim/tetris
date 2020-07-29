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
    var possibleColors = [
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
    for (var i = 0; i < verticalCells; i++) {
        cells[i] = [];
        posCells[i] = [];
        for (var j = 0; j < horizontalCells; j++) {
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
    for (var i = 0; i < verticalCells; i++) {
        for (var j = 0; j < horizontalCells; j++) {
            fill(cells[i][j]);
            rect(j * cellPx, i * cellPx, cellPx, cellPx);
        }
    }
    pop();
}
function rotate(matrix) {
    return matrix[0].map(function (_, colIndex) {
        return matrix.map(function (row) { return row[colIndex]; }).reverse();
    });
}
function applySticker() {
    var size = stickerState.size;
    var matrix = stickerState.matrix;
    var _a = stickerState.coords, y = _a[0], x = _a[1];
    var stickerColor = stickerState.colorString;
    for (var ySticker = 0; ySticker < size; ySticker++) {
        for (var xSticker = 0; xSticker < size; xSticker++) {
            if (!!matrix[ySticker][xSticker]) {
                if (cells[y + ySticker][x + xSticker] ===
                    emptyColorString &&
                    0 <= x + xSticker &&
                    x + xSticker <= horizontalCells - 1 &&
                    0 <= y + ySticker &&
                    y + ySticker <= verticalCells - 1) {
                    cells[y + ySticker][x + xSticker] = stickerColor;
                }
                else {
                    return false;
                }
            }
        }
    }
    return true;
}
function initNewShape(colors) {
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
    initCoords = [0, 0 + delta];
    stickerState = new StickerState(shape, size, initCoords, colors[floor(random(0, colors.length))]);
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