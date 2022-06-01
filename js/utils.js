function rectangularCollision({
  rectangle1,
  rectangle2,
}) {
  return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
          && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
           && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
            && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height);
}

function determineWhoWins({ player, enemy }) {
  document.querySelector('#result').style.display = 'flex';
  if (player.health === enemy.health) {
    document.querySelector('#result').textContent = 'draw';
  } else if (player.health > enemy.health) {
    document.querySelector('#result').textContent = 'Player 1 Wins !';
  } else {
    document.querySelector('#result').textContent = 'Player 2 Wins !';
  }
}
// Timer functionality with result display
let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').textContent = timer;
  }
  if (timer === 0) {
    document.querySelector('#result').style.display = 'flex';
    determineWhoWins({ player, enemy });
  }
}
