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
var global;
var emptyColorString = "pink";
var emptyColor = color(emptyColorString);
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
function applySticker(sticker, size, cells, _a, color) {
    var x = _a[0], y = _a[1];
    if (color === void 0) { color = p5.Color; }
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (!!sticker[i][j]) {
                if (cells[x + i][y + j] === emptyColor) {
                }
            }
        }
    }
    return true;
}
function initNewShape() {
    var initCoords = [0, 0];
    var _a = generatePolygon(), shape = _a[0], size = _a[1];
    var delta = floor(random() * (horizontalCells - size));
    initCoords = [0 + delta, 0];
    shape = rotate(shape);
    return [shape, initCoords];
}
function keyPressed() {
    if (keyCode === UP_ARROW) {
        rotate();
    }
    else if (keyCode === DOWN_ARROW) {
        value = 0;
    }
}
//# sourceMappingURL=build.js.map