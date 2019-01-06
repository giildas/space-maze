// TODO
// better design for portal
// power gauge ??

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

let level = 1

window.setLevel = function (l) {
  level = l
  startLevel()
}

startLevel()

function startLevel () {
  const cols = level + 2
  const cellW = w / cols
  let cellH = cellW // error, might not be a multiple of h
  const rows = Math.ceil(h / cellH)

  cellH = h / rows

  const minCellDim = Math.min(cellW, cellH)

  const maze = new Maze(cols, rows, cellW, cellH)

  const ship = new Ship(cellW / 2, cellH / 2, 10) // starts at top left

  const portalX = maze.furthestCellCoords.i * cellW + cellW / 2
  const portalY = maze.furthestCellCoords.j * cellH + cellH / 2
  const portal = new Portal(portalX, portalY, minCellDim / 2.5)

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

  const collisionWithWall = maze.collides(ship)

  maze.draw(ctx)
  portal.draw(ctx)

  ship.draw(ctx)

  // collision with walls
  if (collisionWithWall) {
    ship.explode(() => {
      ship.resetPos()
    })
  }

  const arrived = portal.collides(ship)

  if (arrived) {
    ship.enterPortal(portal, () => {
      level += 1
      startLevel()
    })
  }

  requestAnimationFrame(() => {
    gameLoop(ship, maze, portal)
  })
}
