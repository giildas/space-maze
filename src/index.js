import Ship from './lib/Ship'
import './app.css'
import Laser from './lib/Laser';
import Asteroid from './lib/Asteroid';

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let w = 600
let h = 300

let gameFinished = false

canvas.width = w
canvas.height = h

let lasers = []
let asteroids = []

let ship = new Ship(w, h, (s) => {
  lasers.push(new Laser(w, h, s.pos.x, s.pos.y, s.angle))
})

for (let i = 0; i < 3; i++) {
  asteroids.push(new Asteroid(w, h))
}

gameLoop()

function gameLoop () {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, w, h)

  ship.update()

  for (let i = lasers.length - 1; i >= 0 ; i--) {
    const laser = lasers[i];
    laser.update()
    laser.draw(ctx)

    if (laser.outOfScreen) {
      lasers.splice(i, 1)
    }
  }

  for (let i = asteroids.length - 1; i >= 0 ; i--) {
    const asteroid = asteroids[i];
    asteroid.update()
    asteroid.draw(ctx)

    for (let j = lasers.length - 1; j >= 0 ; j--) {
      const laser = lasers[j];

      if (laser.hits(asteroid)) {
        // remove asteroid
        asteroids.splice(i, 1)
        // remove laser
        lasers.splice(j, 1)

        // create 4 asteroids
        if (!asteroid.divided) {
          for(let k = 0; k < 4; k++) {
            asteroids.push(new Asteroid(w, h, asteroid.pos.x, asteroid.pos.y, 8, true))
          }
        }

      }
    }

  }
  ship.draw(ctx)

  if (asteroids.length == 0) {
    gameFinished = true
  }



  requestAnimationFrame(gameLoop)

}


