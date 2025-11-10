const canvastodraw = document.getElementById("thiscanvas");
const ctx = canvastodraw.getContext("2d");

ctx.beginPath();
const mouse = { x: 0, y: 0 };
let rect = canvastodraw.getBoundingClientRect();
canvastodraw.width = rect.width;
canvastodraw.height = rect.height;

class Game {
  constructor(x, y) {
    (this.x = x), (this.y = y);
    this.i = 0;
    this.j = 0;

    console.log("new object made");
  }
  update(targetX, targetY) {
    if (this.i < this.mouseX) this.i++;

    const speed = 3; // adjust speed

    const dx = targetX - this.x;
    const dy = targetY - this.y;

    const dist = Math.hypot(dx, dy);

    if (dist > 1) {
      this.x += (dx / dist) * speed;
      this.y += (dy / dist) * speed;
     
    }
  }

  shoot() {
    const d = 2 * this.i;
    const x = this.x;
    const y = this.y;

    ctx.beginPath();
    ctx.arc(x + d, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.lineWidth = 5;
    ctx.fill();
  }
  mainbullet() {
    return { x: this.x, y: this.y };
  }
}

const objects = [];

function bubbles() {
  for (let i = 0; i < 500; i++) {
    objects.push(
      new Game(
        Math.random() * canvastodraw.width,
        Math.random() * canvastodraw.height
      )
    );
  }
}
bubbles();

const bullet = new Game(50, 50);
async function renderer() {
  ctx.clearRect(0, 0, canvastodraw.width, canvastodraw.height);

  bullet.update(mouse.x, mouse.y);
  const coords = bullet.mainbullet();

  for (const obj of objects) {
    // draw point
    obj.shoot();

    // check distance to mouse
    const dx = obj.x - coords.x;
    const dy = obj.y - coords.y;
    const dist = dx * dx + dy * dy;

    if (dist < 100 * 100) {
      // adjust radius to taste
      ctx.beginPath();
      ctx.moveTo(obj.x, obj.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.arc(obj.x, obj.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.stroke();
    }
  }

  requestAnimationFrame(renderer);
}
renderer();

// setInterval(() => {
//     renderer()
// }, 2000);

window.addEventListener("mousemove", (e) => {
  rect = canvastodraw.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

window.addEventListener("resize", () => {
  rect = canvastodraw.getBoundingClientRect();
  canvastodraw.width = rect.width;
  canvastodraw.height = rect.height;
});
