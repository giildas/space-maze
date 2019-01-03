// TODO
// asteroid don't spawn on ship's position
// clean edges teleportation
// cleaner collision detection ship/asteroid
// score
// particles burst on explosion

import Ship from './lib/Ship'
import './app.css'
import Laser from './lib/Laser'
import Asteroid from './lib/Asteroid'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const $level = document.getElementById('level')

const w = 600
const h = 300

canvas.width = w
canvas.height = h

let level = 1
newGame()

function newGame () {
  const lasers = []
  const asteroids = []

  const ship = new Ship(w, h, (s) => {
    lasers.push(new Laser(w, h, s.pos.x, s.pos.y, s.angle))
  })

  for (let i = 0; i < level; i++) {
    asteroids.push(new Asteroid(w, h))
  }
  $level.innerHTML = '<b>Level: </b> ' + level
  gameLoop(ship, asteroids, lasers)
}

function nextGame (e) {
  if (e.keyCode === 32) {
    window.removeEventListener('keydown', nextGame)
    newGame()
  }
}
function restartGame (e) {
  if (e.keyCode === 32) {
    window.removeEventListener('keydown', nextGame)
    newGame()
  }
}

function gameLoop (ship, asteroids, lasers) {
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, w, h)

  ship.update()

  for (let i = lasers.length - 1; i >= 0; i--) {
    const laser = lasers[i]
    laser.update()
    laser.draw(ctx)

    if (laser.outOfScreen) {
      lasers.splice(i, 1)
    }
  }

  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i]
    asteroid.update()
    asteroid.draw(ctx)

    for (let j = lasers.length - 1; j >= 0; j--) {
      const laser = lasers[j]

      if (asteroid.hits(laser)) {
        asteroids.splice(i, 1)
        lasers.splice(j, 1)
        if (!asteroid.divided) {
          for (let k = 0; k < 2; k++) {
            asteroids.push(new Asteroid(w, h, asteroid.pos.x, asteroid.pos.y, 8, true))
          }
        }
      }
    }
    ship.draw(ctx)

    if (asteroid.hits(ship)) {
      ctx.font = '48px serif'
      ctx.fillStyle = '#FFF'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Game over', w / 2, h / 2)
      ctx.font = '16px serif'
      ctx.fillText('Press \'space\' to restart', w / 2, h / 2 + 36)
      level = 1
      window.addEventListener('keydown', nextGame)
      return
    }
  }

  if (asteroids.length === 0) {
    ctx.font = '48px serif'
    ctx.fillStyle = '#FFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Congratulations ! ', w / 2, h / 2)
    ctx.font = '16px serif'
    level = level + 1
    ctx.fillText('Press \'space\' to continue to level ' + level, w / 2, h / 2 + 36)
    window.addEventListener('keydown', nextGame)
    return
  }

  requestAnimationFrame(() => {
    gameLoop(ship, asteroids, lasers)
  })
}
