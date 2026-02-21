const canvas = maze_creator;
console.log(canvas);
canvas.width = 600;
canvas.height = 600;
const ctx = canvas.getContext("2d");
let shapes_cords = [];

function hashIndex(x, y) {
  return ((x + y) * (x + y + 1)) / 2 + y;
}

const WALL = {
  LEFT: 0,
  RIGHT: 1,
  TOP: 2,
  BOTTOM: 3,
};

function create_rigidBodyAt(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
}

class cell {
  constructor(
    posX,
    posY,
    cellDims,
    obstacleManager,
    visited = false,
    parent = null,
  ) {
    this.posX = posX;
    this.posY = posY;
    this.parent = parent;
    this.visited = visited;

    this.wall = [true, true, true, true];

    this.wallThickness = 20;
    this.cellSize = cellDims;

    this.obstacle = obstacleManager;
  }

  create_rigidBodyAt(x1, y1, x2, y2) {
    shapes_cords.push({
      x1: x1,
      y1: y1,
      x2: x2,
      y2,
    });
  }

  delete_rigidBodyAt(x1, y1, x2, y2) {
    shapes_cords = shapes_cords.filter(
      (item) =>
        !(item.x1 === x1 && item.y1 === y1 && item.x2 === x2 && item.y2 === y2),
    );
  }

  updateWall(index, params) {
    if (this.wall[index]) {
      this.create_rigidBodyAt(...params);
    } else {
      this.delete_rigidBodyAt(...params);
    }
  }
  leftwall() {
    const p = [
      this.posX,
      this.posY + 0,
      this.posX + this.wallThickness,
      this.posY + this.cellSize + 0,
    ];
    this.updateWall(0, p);
  }

  rightwall() {
    const x = this.posX + this.cellSize;
    const p = [
      x,
      this.posY + 0,
      x + this.wallThickness,
      this.posY + this.cellSize + 0,
    ];
    this.updateWall(1, p);
  }

  topwall() {
    const p = [
      this.posX + 0,
      this.posY,
      this.posX + this.cellSize + 0,
      this.posY + this.wallThickness,
    ];
    this.updateWall(2, p);
  }

  bottom() {
    const y = this.posY + this.cellSize;
    const p = [
      this.posX + 0,
      y,
      this.posX + this.cellSize + 0,
      y + this.wallThickness,
    ];
    this.updateWall(3, p);
  }

  deleteWall(index) {
    this.wall[index] = false;

    if (index === WALL.LEFT) this.leftwall();
    if (index === WALL.RIGHT) this.rightwall();
    if (index === WALL.TOP) this.topwall();
    if (index === WALL.BOTTOM) this.bottom();
  }
}

const cell_store = new Map();

let cellDims = 50;
function createNodes() {
  let colls = canvas.width;
  let rows = canvas.height;
  for (let j = 0; j < rows; j += cellDims) {
    for (let i = 0; i < colls; i += cellDims) {
      const gridCell = new cell(i, j, cellDims);
      gridCell.leftwall();
      gridCell.rightwall();
      gridCell.topwall();
      gridCell.bottom();
      cell_store.set(hashIndex(gridCell.posX, gridCell.posY), gridCell);
    }
  }
}
createNodes();

function createMaze(cellDims) {
  // stack for backtracking
  let stack = [];

  // pick first / random cell
  let currentCell = cell_store.get(hashIndex(0, 0));
  currentCell.visited = true;

  function makeMaze() {
    redraw();
    // neighbours
    let neighbours = [];

    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.fillRect(currentCell.posX, currentCell.posY, 50, 50);

    let cell1 = cell_store.get(
      hashIndex(currentCell.posX + cellDims, currentCell.posY),
    );
    let cell2 = cell_store.get(
      hashIndex(currentCell.posX - cellDims, currentCell.posY),
    );
    let cell3 = cell_store.get(
      hashIndex(currentCell.posX, currentCell.posY + cellDims),
    );
    let cell4 = cell_store.get(
      hashIndex(currentCell.posX, currentCell.posY - cellDims),
    );

    if (cell1 && !cell1.visited) neighbours.push(cell1);
    if (cell2 && !cell2.visited) neighbours.push(cell2);
    if (cell3 && !cell3.visited) neighbours.push(cell3);
    if (cell4 && !cell4.visited) neighbours.push(cell4);

    if (neighbours.length > 0) {
      // choose random neighbour
      let next = neighbours[Math.floor(Math.random() * neighbours.length)];

      // push current for backtrack
      stack.push(currentCell);

      // link parent (or remove walls here)
      next.parent = currentCell;
      next.visited = true;

      let dx = next.posX - currentCell.posX;
      let dy = next.posY - currentCell.posY;

      // right
      if (dx === cellDims && dy === 0) {
        currentCell.deleteWall(WALL.RIGHT);
        next.deleteWall(WALL.LEFT);
      }

      // left
      if (dx === -cellDims && dy === 0) {
        currentCell.deleteWall(WALL.LEFT);
        next.deleteWall(WALL.RIGHT);
      }

      // bottom (depends on your coordinate system)
      if (dx === 0 && dy === cellDims) {
        currentCell.deleteWall(WALL.BOTTOM);
        next.deleteWall(WALL.TOP);
      }

      // top
      if (dx === 0 && dy === -cellDims) {
        currentCell.deleteWall(WALL.TOP);
        next.deleteWall(WALL.BOTTOM);
      }

      // move forward
      currentCell = next;
    } else if (stack.length > 0) {
      // backtrack
      currentCell = stack.pop();
    } else {
      return;
    }
    // requestAnimationFrame(makeMaze);
  }
  // requestAnimationFrame(makeMaze);
  setInterval(() => {
    makeMaze()
  }, 100);
}
createMaze(cellDims);

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  shapes_cords.forEach(({ x1, y1, x2, y2 }) => {
    create_rigidBodyAt(x1, y1, x2, y2); 
  });
}

redraw();
