// TODO
// better collision on 'lone walls'
// better design for portal
// animation when ship goes into portal
// better difficulty system between levels
// power gauge ??
// cellW : by number of cells in a row
// ==> ship radius relative to width as well

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
// const levelSelect = document.getElementById('level')
// levelSelect.addEventListener('change', () => {
//   level = levelSelect.value
//   newGame()
// })
newGame()

function getCellSize (level) {
  return 120 - ((level) * 10)
}

function newGame () {
  let cellW = getCellSize(level)

  const cols = Math.floor(w / cellW)
  cellW = w / cols // we change slightly cellW so it's a multiple of canvas w
  const rows = Math.floor(h / cellW)
  const cellH = h / rows // the same for cellH

  const maze = new Maze(cols, rows, cellW, cellH)

  const ship = new Ship(cellW / 2, cellH / 2) // starts at top left

  const portalX = maze.furthestCellCoords.i * cellW + cellW / 2
  const portalY = maze.furthestCellCoords.j * cellH + cellH / 2
  const portal = new Portal(portalX, portalY, cellW / 2)

  gameLoop(ship, maze, portal)
}

function gameLoop (ship, maze, portal) {
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#FFF'
  ctx.font = '13px serif'
  const text = `Level ${level}` // - Cell: ${maze.cellW} x ${maze.cellH}`
  ctx.fillText(text, 10, 15)

  ship.update()
  const coll = maze.collides(ship)

  maze.draw(ctx)
  portal.draw(ctx)

  ship.draw(ctx)

  // collision with walls
  if (coll !== false) {
    ship.explode()
    setTimeout(() => {
      ship.resetPos()
    }, 500)
  }

  const arrived = portal.collides(ship)
  if (arrived) {
    level += 1
    newGame()
    return
    // setTimeout(() => {
    //   return
    // }, 3000)
  }

  requestAnimationFrame(() => {
    gameLoop(ship, maze, portal)
  })
}
