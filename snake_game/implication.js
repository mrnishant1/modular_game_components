//game is world and contains canvas
const game = new Scene(canvas, context);

//snake is Linked List consHeads nodes named as "Game_Objects"
const snake_body = new snake();
//appendLL is function to append node in LinkedList
snake_body.appendLL(game,200,200);
snake_body.appendLL(game,0,0);
// snake_body.appendLL(game);
// snake_body.appendLL(game);
console.log(snake_body.Head,"hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

//setGameObject -- helps to push snake part to snake_body[] in game world 
//help in render game_Objects in world 
game.setGameObject(snake_body);

//Keypress for direction
window.addEventListener("keydown", (e) => {
  snake_body.Head.setDirection(e.code);
});

//to animate continuous
function animate() {
  game.renderAnimation(snake_body.Head);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
