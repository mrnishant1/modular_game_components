const canvas = snake_game;
const context = canvas.getContext("2d");
class Scene {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.canvas.width = "800";
    this.canvas.height = "800";
    this.canvas.style.backgroundColor = "gray";
    this.entities = [];
    this.stopAnimate = false;
    this.food = new class_food(this);

    this.snake_speed = 2;

    this.snake_body = null;
  }
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  setGameObject(entity) {
    // this recieve an entire linkedList object
    this.snake_body = entity;
  }

  gameOver() {
    alert("Game Over");
    this.stopAnimate = true;
  }
  //what i want is to check colisioin b/w food and snake
  checkCollision() {
    const snake = this.snake_body.Head;
    if (!snake) return;
    const x1 = snake.posX + snake.width / 2;
    const y1 = snake.posY + snake.height / 2;
    const x2 = this.food.posX + this.food.width / 2;
    const y2 = this.food.posY + this.food.height / 2;
    const distance = Math.hypot(x2 - x1, y2 - y1); // use + inside sqrt
    // console.log(x2,x1,y2,y1);

    if (distance <= 70) {
      this.food.spawn();
      this.snake_speed += 0.005;
      this.entities.push(
        new Game_object(this, snake.posX - snake.width, snake.posY),
      );
      console.log(this.entities);
    }
  }

  renderAnimation() {
    if (this.stopAnimate) return;
    // this.checkCollision();
    this.clearCanvas();
    this.food.draw();
    this.snake_body.moveHead_rest_follow(this.snake_speed);
    // this.snake_body.forEach(() => {
    // });
  }
}

//Linked list of game_objects forms body of snake
class snake {
  constructor() {
    this.Head = null;
  }
  appendLL(scene, posX, posY) {
    const newNode = new Game_object(scene, posX, posY);

    if (!this.Head) {
      this.Head = newNode;
    } else {
      newNode.next = this.Head;
      this.Head = newNode;
    }
  }
  moveAll(speed) {
    let current = this.Head;
    while (current) {
      current.draw();
      current.move(speed);
      current = current.next;
    }
  }
  moveHead_rest_follow(speed) {
    let current = this.Head;
    current.draw();
    while (current) {
      if (current.next) {
        current.posX = current.next.posX+200;
        current.posY = current.next.posY+200;
      } else {
        current.move(speed);
      }
      current = current.next;
    }
    console.log(this.Head);
  }
}

class Game_object {
  constructor(scene, posX, posY) {
    //this next points to next node ("game_object")
    this.next = null;

    this.height = 100;
    this.width = 100;
    this.color = "red";
    this.scene = scene;
    this.posX = posX || 0;
    this.posY = posY || 0;
    this.direction = "";
  }
  draw() {
    this.scene.context.fillRect(this.posX, this.posY, this.width, this.height);
  }
  setDirection(direction) {
    this.direction = direction;
  }

  // checkCollision() {
  //   this.posX > this.scene.canvas.width - this.width ||
  //   this.posX < 0 ||
  //   this.posY > this.scene.canvas.height - this.height ||
  //   this.posY < 0
  //     ? this.scene.gameOver()
  //     : "";
  // }

  move(speed) {
    // this.checkCollision();

    switch (this.direction) {
      case "ArrowLeft":
        this.posX -= speed;
        break;
      case "ArrowRight":
        this.posX += speed;
        break;
      case "ArrowUp":
        this.posY -= speed;
        break;
      case "ArrowDown":
        this.posY += speed;
        break;
    }
  }
}

class class_food {
  constructor(scene) {
    this.scene = scene;
    this.width = 50;
    this.height = 50;
    this.posX = Math.random() * this.scene.canvas.width - this.width;
    this.posY = Math.random() * this.scene.canvas.height - this.height;
  }

  draw() {
    this.scene.context.fillRect(this.posX, this.posY, this.width, this.height);
  }
  move() {}
  spawn() {
    this.posX = Math.random() * (this.scene.canvas.width - this.width);
    this.posY = Math.random() * (this.scene.canvas.height - this.height);
  }
}
