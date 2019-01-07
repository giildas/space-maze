// TODO
// better design for portal : warp zone(?) / black hole / mothership
// cleaner structure for anims
// global Keyboard events class...
// start menu
// end level
// screens between levels with stats (time, nb of tries...)
// procedural backgrounds (nebulae, clouds, stars  ...)

import './app.css'
import Ship from './lib/Ship'
import Maze from './lib/Maze'
import Portal from './lib/Portal'
import Keys from './lib/Keys'

const OPTIONS = {
  shipAngleOffset: 0.15,
  shipBoostPower: 0.06
}

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const w = 600
const h = 300

canvas.width = w
canvas.height = h

let level = 1

const keyboard = new Keys()

startLevel()

function startLevel () {
  // maze grid size calculation
  const cols = level + 2
  const cellW = w / cols
  let cellH = cellW
  const rows = Math.ceil(h / cellH)
  cellH = h / rows

  // maze initialization
  const maze = new Maze(cols, rows, cellW, cellH)

  // portal initialization
  const portalX = maze.furthestCellCoords.i * cellW + cellW / 2
  const portalY = maze.furthestCellCoords.j * cellH + cellH / 2
  const minCellDim = Math.min(cellW, cellH)
  const portal = new Portal(portalX, portalY, minCellDim / 2.5)

  // ship initialization
  const ship = new Ship(cellW / 2, cellH / 2, 10) // always starts at top left
  // ship controls
  keyboard.addKeyDownAction(37, () => ship.startTurning(-OPTIONS.shipAngleOffset))
  keyboard.addKeyDownAction(39, () => ship.startTurning(OPTIONS.shipAngleOffset))
  keyboard.addKeyDownAction(38, () => ship.startBoost(OPTIONS.shipBoostPower))
  keyboard.addKeyUpAction(37, () => ship.stopTurning())
  keyboard.addKeyUpAction(39, () => ship.stopTurning())
  keyboard.addKeyUpAction(38, () => ship.stopBoost())

  requestAnimationFrame((time) => {
    gameLoop(ship, maze, portal, time)
  })
}

function gameLoop (ship, maze, portal, time) {
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#FFF'
  ctx.font = '13px sans-serif'
  const text = `Level ${level}` // - Time: ${time}` // - Cell: ${maze.cellW} x ${maze.cellH}`
  ctx.fillText(text, 10, 15)

  ship.update()

  const collisionWithWall = maze.collides(ship)

  maze.draw(ctx)
  portal.draw(ctx, time)

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

  requestAnimationFrame((time) => {
    gameLoop(ship, maze, portal, time)
  })
}
