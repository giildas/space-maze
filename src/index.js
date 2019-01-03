import Ship from './lib/Ship'
import './app.css'
import Laser from './lib/Laser';

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let w = 600
let h = 300

canvas.width = w
canvas.height = h

let lasers = []
let ship = new Ship(w, h)

let ship = new Ship(w, h, (s) => {
  lasers.push(new Laser(w, h, s.pos.x, s.pos.y, s.angle))
})

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
  ship.draw(ctx)
  requestAnimationFrame(gameLoop)
}


