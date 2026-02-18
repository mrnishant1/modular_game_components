const canvas = goap_game;
console.log(canvas);
canvas.width = "600";
canvas.height = "600";
const CELL_SIZE = 16;

const ctx = canvas.getContext("2d");
const walkable = {};

const blocked = new Set();

class Create_Obstacle {
  constructor(ctx, CELL_SIZE) {
    this.ctx = ctx;
    this.shapes_cords = [];
    this.isMouseDown = false;
    this.start = null;
    this.CELL_SIZE = CELL_SIZE;

    window.addEventListener("mousemove", (e) => this.#onMouseMove(e));
    window.addEventListener("mouseup", (e) => this.#onMouseUp(e));
  }

  RigidBody(x, y, w, h) {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(x, y, w, h);
  }

  #redraw(preview = null) {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw saved shapes
    this.shapes_cords.forEach(({ x1, y1, x2, y2 }) => {
      this.RigidBody(x1, y1, x2 - x1, y2 - y1);
    });

    // draw preview if exists
    if (preview) {
      this.RigidBody(preview.x1, preview.y1, preview.w, preview.h);
    }
  }
  #addBlockedPoints_anotherMethod(xmin, xmax, ymin, ymax) {
    const startCol = xmin - (xmin % (CELL_SIZE / 2));
    const endCol = xmax - (xmax % (CELL_SIZE / 2));
    const startRow = ymin - (ymin % (CELL_SIZE / 2));
    const endRow = ymax - (ymax % (CELL_SIZE / 2));

    for (let y = startRow; y <= endRow; y += CELL_SIZE) {
      for (let x = startCol; x <= endCol; x += CELL_SIZE) {
        // console.log(x,y);
        blocked.add(hashIndex(x, y, this.CELL_SIZE));
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  #addBlockedPoints(xmin, xmax, ymin, ymax) {
    const startCol = Math.floor(xmin / CELL_SIZE);
    const endCol = Math.floor(xmax / CELL_SIZE);
    const startRow = Math.floor(ymin / CELL_SIZE);
    const endRow = Math.floor(ymax / CELL_SIZE);

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        blocked.add(hashIndex(col, row, CELL_SIZE));

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

    this.#redraw({
      x1: this.start.x,
      y1: this.start.y,
      w,
      h,
    });
  }

  #onMouseUp(e) {
    if (!this.isMouseDown) return;

    this.isMouseDown = false;

    const x2 = e.clientX;
    const y2 = e.clientY;

    this.shapes_cords.push({
      x1: this.start.x,
      y1: this.start.y,
      x2,
      y2,
    });

    this.#redraw();

    const xmin = Math.min(this.start.x, x2);
    const xmax = Math.max(this.start.x, x2);
    const ymin = Math.min(this.start.y, y2);
    const ymax = Math.max(this.start.y, y2);

    this.#addBlockedPoints(xmin, xmax, ymin, ymax);
    console.log(blocked);
    BakeMesh();
  }

  createRigidBody(e) {
    this.isMouseDown = true;
    this.start = {
      x: e.clientX,
      y: e.clientY,
    };
  }
}

function hashIndex(x, y, CELL_SIZE) {
  return (((x + y) * (x + y + 1)) / 2 + y);
}

const body = new Create_Obstacle(ctx, CELL_SIZE);
window.addEventListener("mousedown", (estart) => {
  body.createRigidBody(estart);
});

function BakeMesh() {
  for (let i = 0; i < canvas.height; i+=8) {
    for (let j = 0; j < canvas.width; j+=8) {
      let x = Math.floor(j / CELL_SIZE);
      let y = Math.floor(i / CELL_SIZE);

      // walkable[point] = true;
      if (!blocked.has(hashIndex(x, y, CELL_SIZE))) {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(j, i, 2, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.fillStyle = "pink";
        ctx.arc(j, i, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
}
