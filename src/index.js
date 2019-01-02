import Ship from './lib/Ship'
import './app.css'

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let w = 300
let h = 300

canvas.width = w
canvas.height = h

let ship = new Ship(w, h)

gameLoop()

ctx.fillStyle = 'green';

function gameLoop () {
  ctx.clearRect(0, 0, w, h)
  ship.update()
  drawShip()
  requestAnimationFrame(gameLoop)
}


function drawShip () {
  ctx.save()
    ctx.translate(ship.pos.x, ship.pos.y)
    ctx.rotate(ship.angle)
    ctx.beginPath();
      ctx.moveTo(-ship.w/2, -ship.h/2);
      ctx.lineTo(ship.w/2, 0);
      ctx.lineTo(-ship.w/2, ship.h/2);
    ctx.fill();
  ctx.restore()
}


