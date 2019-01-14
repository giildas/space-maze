// TODO
// better design for portal : warp zone(?) / black hole / mothership
// cleaner structure for anims
// global Keyboard events class...
// start menu
// end level
// screens between levels with stats (time, nb of tries...)
// procedural backgrounds or walls (nebulae, clouds, stars  ...)

import './app.css'
import Ship from './lib/Ship'
import Maze from './lib/Maze'
import Portal from './lib/Portal'
import Keys from './lib/Keys'

import { round } from './lib/Utils'

const OPTIONS = {
  shipAngleOffset: 10, // speed of turning
  shipBoostPower: 10, // the lower the harder
  debug: true
}

const keyboard = new Keys(OPTIONS.debug)

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const w = 600
const h = 300

canvas.width = w
canvas.height = h

let level = 1
let maze, ship, portal

startLevel()
requestAnimationFrame(gameLoop)

function startLevel () {
  // maze grid size calculation
  const cols = level + 2
  const cellW = w / cols
  let cellH = cellW
  const rows = Math.ceil(h / cellH)
  cellH = h / rows

  // maze initialization
  maze = new Maze(cols, rows, cellW, cellH)

  // portal initialization
  const portalX = maze.furthestCellCoords.i * cellW + cellW / 2
  const portalY = maze.furthestCellCoords.j * cellH + cellH / 2
  const minCellDim = Math.min(cellW, cellH)

  portal = new Portal(portalX, portalY, minCellDim / 2.5)

  // ship initialization
  ship = new Ship(cellW / 2, cellH / 2, 10) // always starts at top left
  // ship controls
  if (level == 1) {
    keyboard.addKeysAction(37, () => ship.startTurning(-OPTIONS.shipAngleOffset), () => ship.stopTurning())
    keyboard.addKeysAction(39, () => ship.startTurning(OPTIONS.shipAngleOffset), () => ship.stopTurning())
    keyboard.addKeysAction(38, () => ship.startBoost(OPTIONS.shipBoostPower), () => ship.stopBoost())
  }
}
// rubbish code to change fps and test that speed of ship and all is stable
const fps_input = document.getElementById('fps')

let tgtFps = 60
const intervalTolerance = 10 // in ms, tolerance

fps_input.onchange = (e) => {
  tgtFps = e.target.checked ? 60 : 20
}
let prevTime = 0

function gameLoop (time) {
  const deltaTime = time - prevTime
  const targetInterval = 1000 / tgtFps
  requestAnimationFrame(gameLoop)
  if (deltaTime >= targetInterval - intervalTolerance) {
    const framerate = 1000.0 / (time - prevTime)
    prevTime = time
    ctx.fillStyle = '#222'
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = '#FFF'
    ctx.font = '13px sans-serif'
    const text = `Level ${level} - deltaTime: ${deltaTime} - fps: ${framerate}` // - Time: ${time}` // - Cell: ${maze.cellW} x ${maze.cellH}`
    ctx.fillText(text, 10, 15)
    const velPerMs = ship.vel.mag
    const accPerMs = ship.acceleration.mag
    const text2 = `Ship vel: ${round(velPerMs, 3)} - Ship acc: ${round(accPerMs, 3)}` // - Time: ${time}` // - Cell: ${maze.cellW} x ${maze.cellH}`
    ctx.fillText(text2, 10, 30)

    ship.update(deltaTime)
    if (OPTIONS.debug) ship.edges(w, h)

    const collisionWithWall = OPTIONS.debug ? false : maze.collides(ship)
    const arrived = OPTIONS.debug ? false : portal.collides(ship)

    maze.draw(ctx, time)
    portal.draw(ctx, time)

    ship.draw(ctx, time)

    // collision with walls
    if (collisionWithWall) {
      ship.explode(() => {
        ship.resetPos()
      })
    }

    if (arrived) {
      ship.enterPortal(portal, () => {
        level += 1
        startLevel()
        prevTime = 0
      })
    }
  }
}
