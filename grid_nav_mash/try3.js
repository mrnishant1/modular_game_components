const canvas = goap_game;
console.log(canvas);
canvas.width = "600";
canvas.height = "600";
const CELL_SIZE = 8;

const ctx = canvas.getContext("2d");
const walkable = {};
const blocked = new Set();
let target_coordinate = { x: 500, y: 500 };
let shapes_cords = [];
let myInterval = null;

function calculateDistance(target, current) {
  let distance =
    Math.abs(target.x - current.x) + Math.abs(target.y - current.y);
  return distance;
}
function hashIndex(x, y) {
  return ((x + y) * (x + y + 1)) / 2 + y;
}
function isBlocked(cordinate) {
  return blocked.has(
    hashIndex(
      Math.floor(cordinate.x / CELL_SIZE),
      Math.floor(cordinate.y / CELL_SIZE),
    ),
  );
}




class Create_Obstacle {
  constructor(ctx, CELL_SIZE) {
    this.ctx = ctx;
    this.isMouseDown = false;
    this.start = null;
    this.CELL_SIZE = CELL_SIZE;

    window.addEventListener("mousemove", (e) => this.#onMouseMove(e));
    window.addEventListener("mouseup", (e) => this.#onMouseUp(e));
  }

  hashIndex(x, y) {
    return ((x + y) * (x + y + 1)) / 2 + y;
  }

  BakeMesh() {
    for (let i = 0; i < canvas.height; i += CELL_SIZE) {
      for (let j = 0; j < canvas.width; j += CELL_SIZE) {
        let x = Math.floor(j / CELL_SIZE);
        let y = Math.floor(i / CELL_SIZE);
        // walkable[point] = true;
        if (!blocked.has(body.hashIndex(x, y))) {
          ctx.beginPath();
          ctx.fillStyle = "blue";
          ctx.arc(j, i, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }

  RigidBody(x, y, w, h) {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(x, y, w, h);
  }

  #addBlockedPoints(xmin, xmax, ymin, ymax) {
    const startCol = Math.floor(xmin / CELL_SIZE);
    const endCol = Math.floor(xmax / CELL_SIZE);
    const startRow = Math.floor(ymin / CELL_SIZE);
    const endRow = Math.floor(ymax / CELL_SIZE);

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        blocked.add(this.hashIndex(col, row, CELL_SIZE));

        // debug draw at cell center
        const cx = col * CELL_SIZE + CELL_SIZE / 2;
        const cy = row * CELL_SIZE + CELL_SIZE / 2;

        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  #onMouseMove(e) {
    if (!this.isMouseDown) return;

    const w = e.clientX - this.start.x;
    const h = e.clientY - this.start.y;

    redraw({
      x1: this.start.x,
      y1: this.start.y,
      w,
      h,
    });
  }

  #onMouseUp(e) {
    if (!this.isMouseDown) return;

    this.isMouseDown = false;
    if (this.start.x == e.clientX && this.start.y == e.clientY) return;

    const x2 = e.clientX;
    const y2 = e.clientY;

    shapes_cords.push({
      x1: this.start.x,
      y1: this.start.y,
      x2,
      y2,
    });

    redraw();

    const xmin = Math.min(this.start.x, x2);
    const xmax = Math.max(this.start.x, x2);
    const ymin = Math.min(this.start.y, y2);
    const ymax = Math.max(this.start.y, y2);

    this.#addBlockedPoints(xmin, xmax, ymin, ymax);
    // console.log(blocked);
    this.BakeMesh();
  }

  create_rigid_obstacle(e) {
    this.isMouseDown = true;
    this.start = {
      x: e.clientX,
      y: e.clientY,
    };
  }
}

class Game_object {
  constructor(posX, posY, ctx) {
    this.ctx = ctx;
    this.next = null;
    this.height = 50;
    this.width = 50;
    this.color = "black";
    this.posX = posX || 0;
    this.posY = posY || 0;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "orange";
    this.ctx.arc(this.posX, this.posY, 10, 0, 2 * Math.PI);
    this.ctx.fill();
    // console.log(this.posX, this.posY);
  }
  hashIndex(x, y) {
    return ((x + y) * (x + y + 1)) / 2 + y;
  }
  isBlocked(x, y, CELL_SIZE) {
    return !blocked.has(
      this.hashIndex(Math.floor(x / CELL_SIZE), Math.floor(y / CELL_SIZE)),
    );
  }

  move(speed, direction) {
    switch (direction) {
      case "ArrowLeft":
        if (this.isBlocked(this.posX - speed, this.posY, CELL_SIZE)) {
          this.posX -= speed;
          break;
        } else break;

      case "ArrowRight":
        if (this.isBlocked(this.posX + speed, this.posY, CELL_SIZE)) {
          this.posX += speed;
          break;
        } else break;

      case "ArrowUp":
        if (this.isBlocked(this.posX, this.posY - speed, CELL_SIZE)) {
          this.posY -= speed;
          break;
        } else break;
      case "ArrowDown":
        if (this.isBlocked(this.posX, this.posY + speed, CELL_SIZE)) {
          this.posY += speed;
          break;
        } else break;
    }

    redraw();
  }

  moveToCoordinate(x, y) {
    this.posX = x;
    this.posY = y;
    redraw();
  }
}

//============>
// re-renderer
//<===========
function redraw(preview = null) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw saved shapes
  shapes_cords.forEach(({ x1, y1, x2, y2 }) => {
    body.RigidBody(x1, y1, x2 - x1, y2 - y1);
  });
  enemy.draw();
  player.draw();

  // draw preview if exists
  if (preview) {
    body.RigidBody(preview.x1, preview.y1, preview.w, preview.h);
  }
}

//====================//
//    Class Use       //
//====================//

const body = new Create_Obstacle(ctx, CELL_SIZE);

window.addEventListener("mousedown", (estart) => {
  body.create_rigid_obstacle(estart);
});

const enemy = new Game_object(0, 0, ctx);
enemy.draw();

window.addEventListener("keydown", (e) => enemy.move(20, e.code));
