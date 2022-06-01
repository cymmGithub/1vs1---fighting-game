/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable default-case */
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;
c.fillRect(0, 0, canvas.width, canvas.height);
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './assets/Battleground3.png',
});

const player = new Fighter({
  position: {
    x: 190,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  imageSrc: './assets/princeLu/Idle.png',
  scale: 2.5,
  framesMax: 10,
  offset: {
    x: 140,
    y: 75,
  },
  sprites: {
    idle: {
      imageSrc: './assets/princeLu/Idle.png',
      framesMax: 10,
    },
    run: {
      imageSrc: './assets/princeLu/Run.png',
      framesMax: 8,

    },
    jump: {
      imageSrc: './assets/princeLu/Going Up.png',
      framesMax: 3,

    },
    fall: {
      imageSrc: './assets/princeLu/Going Down.png',
      framesMax: 3,

    },
    attack2: {
      imageSrc: './assets/princeLu/Attack2.png',
      framesMax: 6,

    },
    takeHit: {
      imageSrc: './assets/princeLu/Take Hit.png',
      framesMax: 3,

    },
    death: {
      imageSrc: './assets/princeLu/Death.png',
      framesMax: 11,
    },
  },
  attackBox: {
    offset: {
      x: 50,
      y: 40,
    },
    width: 112,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 800,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',

  imageSrc: './assets/amazonHuntress/Idle.png',
  scale: 2.5,
  framesMax: 8,
  offset: {
    x: 180,
    y: 113,
  },
  sprites: {
    idle: {
      imageSrc: './assets/amazonHuntress/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './assets/amazonHuntress/Run.png',
      framesMax: 8,

    },
    jump: {
      imageSrc: './assets/amazonHuntress/Jump.png',
      framesMax: 2,

    },
    fall: {
      imageSrc: './assets/amazonHuntress/Fall.png',
      framesMax: 2,

    },
    attack2: {
      imageSrc: './assets/amazonHuntress/Attack2.png',
      framesMax: 5,

    },
    takeHit: {
      imageSrc: './assets/amazonHuntress/Take hit.png',
      framesMax: 3,

    },
    death: {
      imageSrc: './assets/amazonHuntress/Death.png',
      framesMax: 8,
    },
  },
  attackBox: {
    offset: {
      x: -120,
      y: 40,
    },
    width: 110,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  c.fillStyle = 'rgba(255,255,255, 0.1)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  enemy.velocity.x = 0;
  player.velocity.x = 0;

  // Player movement
  // Right - Left
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }
  // Player Jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.switchSprite('run');
    enemy.velocity.x = 5;
  } else {
    enemy.switchSprite('idle');
  }
  // Enemy Jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  // Detection for collision - player attack && enemy gets hit
  if (rectangularCollision({
    rectangle1: player,
    rectangle2: enemy,
  }) && player.isAttacking && player.framesCurrent === 4) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to('#enemyHealth', {
      width: `${enemy.health}%`,
    });
  }
  // Player miss condition
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // Detection for collision - enemy attack
  if (rectangularCollision({
    rectangle1: enemy,
    rectangle2: player,
  }) && enemy.isAttacking && enemy.framesCurrent === 2) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to('#playerHealth', {
      width: `${player.health}%`,
    });
  }
  // Enemy miss condition
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }
  // Game end based on player's health

  if (enemy.health <= 0 || player.health <= 0) {
    determineWhoWins({ player, enemy });
    clearTimeout(timerId);
  }
}

animate();

window.addEventListener('keydown', (e) => {
  if (!player.dead) {
  // Player movement - keys
    switch (e.key) {
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        player.velocity.y = -20;
        break;

      case ' ':
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch (e.key) {
      // Enemy movement-keys
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;

      case 'ArrowUp':
        enemy.velocity.y = -20;
        break;
      case 'm':

        enemy.attack();
        break;
    }
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
      // Enemy case
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});
