import Ship from './lib/Ship'
import './app.css'

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let w = 600
let h = 300

canvas.width = w
canvas.height = h

let ship = new Ship(w, h)

gameLoop()


function gameLoop () {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, w, h)

  ship.update()
  ship.draw(ctx)
  requestAnimationFrame(gameLoop)
}


