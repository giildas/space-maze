// TODO
// asteroid don't spawn on ship's position
// clean edges teleportation
// cleaner collision detection ship/asteroid
// score
// levels
// game over message
// nice colors
// particles burst on explosion

import Ship from './lib/Ship'
import './app.css'
import Laser from './lib/Laser';
import Asteroid from './lib/Asteroid';

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let w = 600
let h = 300


canvas.width = w
canvas.height = h
let gameFinished;
newGame()
function newGame () {
  let lasers = []
  let asteroids = []
  gameFinished = false

  let ship = new Ship(w, h, (s) => {
    lasers.push(new Laser(w, h, s.pos.x, s.pos.y, s.angle))
  })

  for (let i = 0; i < 2; i++) {
    asteroids.push(new Asteroid(w, h))
  }

  gameLoop(ship, asteroids, lasers)
}


function gameLoop (ship, asteroids, lasers) {
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

    if (asteroid.hits(ship)) {
      gameFinished = true
    }

    for (let j = lasers.length - 1; j >= 0 ; j--) {
      const laser = lasers[j];

      if (asteroid.hits(laser)) {
        asteroids.splice(i, 1)
        lasers.splice(j, 1)
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

  if (!gameFinished) {
    requestAnimationFrame(() => {
      gameLoop(ship, asteroids, lasers)
    })
  } else {
    newGame()
  }

}


