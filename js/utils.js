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

const soundEffects = {
  maleAttackSound: new Audio('./assets/sounds/swordAttack3.mp3'),
  femaleAttackSound: new Audio ('./assets/sounds/femaleAttack.mp3'),
  malePain: new Audio('./assets/sounds/malePain.mp3'),
  maleTakeHit: new Audio('./assets/sounds/maleTakeHit2.mp3'),
  femalePain: new Audio('./assets/sounds/femalePain.mp3'),
  femaleTakeHit: new Audio('./assets/sounds/femaleTakeHit.mp3'),


}
soundEffects.femaleTakeHit.volume = 0.5;
soundEffects.maleTakeHit.volume = 0.5;
soundEffects.malePain.volume = 0.5;

export { rectangularCollision, determineWhoWins, soundEffects};