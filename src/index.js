// TODO
// cleaner structure for anims
// start menu & end level
// screens between levels with stats (time, nb of tries...)
// procedural backgrounds or walls (nebulae, clouds, stars  ...)
// use some game engine structure

import './app.css'

import canvasGameEngine from './lib/canvasGameEngine'
import Keys from './lib/Keys'
// import { round } from './lib/Utils'

import Ship from './Ship'
import Maze from './Maze'
import Portal from './Portal'

const OPTIONS = {
  shipAngleOffset: 10, // speed of turning
  shipBoostPower: 10, // the lower the harder
  debug: false
}

const keyboard = new Keys(OPTIONS.debug)

class Mazesteroid extends canvasGameEngine {
  setup () {
    // game state
    this.level = 1
    // game objects

    // maze grid size calculation
    const cols = this.level + 2
    const cellW = this.w / cols
    let cellH = cellW
    const rows = Math.ceil(this.h / cellH)
    cellH = this.h / rows

    this.maze = new Maze(cols, rows, cellW, cellH)

    // portal initialization
    const portalX = this.maze.furthestCellCoords.i * cellW + cellW / 2
    const portalY = this.maze.furthestCellCoords.j * cellH + cellH / 2
    const minCellDim = Math.min(cellW, cellH)

    this.portal = new Portal(portalX, portalY, minCellDim / 2.5)

    // ship initialization
    this.ship = new Ship(cellW / 2, cellH / 2, 10) // always starts at top left

    // game events
    keyboard.addKeysAction(37, () => this.ship.startTurning(-OPTIONS.shipAngleOffset), () => this.ship.stopTurning())
    keyboard.addKeysAction(39, () => this.ship.startTurning(OPTIONS.shipAngleOffset), () => this.ship.stopTurning())
    keyboard.addKeysAction(38, () => this.ship.startBoost(OPTIONS.shipBoostPower), () => this.ship.stopBoost())
  }
  loop (elapsedTime) {
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, this.w, this.h)

    this.ship.update(elapsedTime)
    if (OPTIONS.debug) this.ship.edges(this.w, this.h)

    const collisionWithWall = OPTIONS.debug ? false : this.maze.collides(this.ship)
    const arrived = OPTIONS.debug ? false : this.portal.collides(this.ship)

    this.maze.draw(this.ctx)
    this.portal.draw(this.ctx)
    this.ship.draw(this.ctx)

    // collision with walls
    if (collisionWithWall) {
      this.ship.explode(() => {
        this.ship.resetPos()
      })
    }

    if (arrived) {
      this.ship.enterPortal(this.portal, () => {
        this.level += 1
      })
    }
  }
}

// make the game and start it
new Mazesteroid('canvas', 'Maze Asteroid', 600, 300).start()
