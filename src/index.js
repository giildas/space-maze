// TODO
// better collision on 'lone walls'
// better design for portal
// animation when ship goes into portal
// animation when ship explodes
// life system (3 lives before die ?)
// ==> bounce off walls

import Ship from './lib/Ship'
import Maze from './lib/Maze'
import Portal from './lib/Portal'

import './app.css'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const w = 600
const h = 300

canvas.width = w
canvas.height = h

window.options = {
  collisions: true,
  collisionsDebugCircle: false
}
let level = 1
newGame()
// 1 : 80
// 2 : 75
// 3 : 70
function newGame () {
  let cellW = 80 - ((level - 1) * 5) // ideally
  const cols = Math.floor(w / cellW)
  cellW = w / cols // we change cellW so it's ok with canvas w
  const rows = Math.floor(h / cellW)
  const cellH = h / rows
  const maze = new Maze(cols, rows, cellW, cellH)

  console.log('LEVEL', level, cellW)
  const ship = new Ship(w, h, cellW / 2, cellH / 2, cellW / 4, (s) => {
    console.log('space pressed')
  })

  const portalX = maze.furthestCellCoords.i * cellW + cellW / 2
  const portalY = maze.furthestCellCoords.j * cellH + cellH / 2
  const portal = new Portal(portalX, portalY, cellW / 2)

  gameLoop(ship, maze, portal)
}

// function nextGame (e) {
//   if (e.keyCode === 13) {
//     window.removeEventListener('keydown', nextGame, true)
//     newGame()
//   }
// }

function gameLoop (ship, maze, portal) {
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#FFF'
  ctx.fillText('Level ' + level, 10, 10)

  ship.update()
  maze.draw(ctx)

  portal.draw(ctx)
  ship.draw(ctx)

  const coll = maze.collides(ship)
  if (coll !== false) {
    ship.resetPos()
    // level = 1
    // newGame()
    // return
  }

  const arrived = portal.collides(ship)
  if (arrived) {
    level += 1
    newGame()
    return
  }

  requestAnimationFrame(() => {
    gameLoop(ship, maze, portal)
  })
}
