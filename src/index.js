// TODO
// dont use setTimeout for anims
// stats between levels (time, nb of tries...)
// procedural backgrounds or walls (nebulae, clouds, stars  ...)
// => perlin noise seems to be the thing
// procedural sounds
// procedural light in front of the ship, cf https://www.youtube.com/watch?v=fc3nnG2CG8U

// careful : rotating movement shouldn't stop, it's space !!!

import './app.css'

import canvasGameEngine from './lib/canvasGameEngine'
import Keys from './lib/Keys'

import Ship from './Ship'
import Maze from './Maze'
import Portal from './Portal'

const OPTIONS = {
  shipAngleOffset: 10, // speed of turning
  shipBoostPower: 10, // the lower the harder
  debug: false,
  wallCollision: false,
  portalCollision: false,
  lastLevel: 8 // level 3 will be the last one
}

const GAME_IS = {
  UNSTARTED: 0,
  RUNNING: 1,
  PAUSED: 2,
  FINISHED: 3,
  LOST: 4
}

const keyboard = new Keys(OPTIONS.debug)

class Mazesteroid extends canvasGameEngine {
  setup () {
    // game state
    this.level = 1
    this.gameState = GAME_IS.UNSTARTED
    this.newLevel()

    // game events
    keyboard.addKeysAction(37, () => this.ship.startTurning(-OPTIONS.shipAngleOffset), () => this.ship.stopTurning())
    keyboard.addKeysAction(39, () => this.ship.startTurning(OPTIONS.shipAngleOffset), () => this.ship.stopTurning())
    keyboard.addKeysAction(38, () => {
      if (this.gameState === GAME_IS.RUNNING) this.ship.startBoost(OPTIONS.shipBoostPower)
    }, () => this.ship.stopBoost())
    keyboard.addKeyDownAction(82, () => this.ship.resetPos())
    keyboard.addKeyDownAction(32, () => {
      // some logic
      switch (this.gameState) {
        case GAME_IS.UNSTARTED:
          this.gameState = GAME_IS.RUNNING
          break
        case GAME_IS.RUNNING:
          this.gameState = GAME_IS.PAUSED
          break
        case GAME_IS.PAUSED:
          this.gameState = GAME_IS.RUNNING
          break
        case GAME_IS.FINISHED:
        case GAME_IS.LOST:
          this.gameState = GAME_IS.RUNNING
          this.level = 1
          this.newLevel()
          break
      }
    })
  }

  newLevel () {
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

    const isLastLevel = OPTIONS.lastLevel === this.level
    this.portal = new Portal(portalX, portalY, minCellDim / 2.5, isLastLevel)

    // ship initialization
    this.ship = new Ship(cellW / 2, cellH / 2, 10) // always starts at top left
  }

  loop (elapsedTime) {
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, this.w, this.h)

    this.maze.draw(this.ctx)
    this.portal.draw(this.ctx)
    this.ship.draw(this.ctx)

    const text = `Level: ${this.level}`
    this.ctx.fillStyle = '#FFF'
    this.ctx.textAlign = 'left'
    this.ctx.fillText(text, 15, 15)

    if (this.gameState === GAME_IS.RUNNING) {
      this.ship.update(elapsedTime)
      this.ship.edges(this.w, this.h)

      const collisionWithWall = OPTIONS.wallCollision ? this.maze.collides(this.ship) : false
      const arrived = OPTIONS.portalCollision ? this.portal.collides(this.ship) : false

      // collision with walls
      if (collisionWithWall) {
        this.ship.explode(() => {
          this.ship.resetPos()
        })
      }

      if (arrived) {
        this.ship.enterPortal(this.portal, () => {
          if (this.level + 1 > OPTIONS.lastLevel) {
            this.gameState = GAME_IS.FINISHED
          } else {
            this.gameState = GAME_IS.UNSTARTED
            this.level += 1
            this.newLevel()
          }
        })
      }
    } else {
      this.ctx.fillStyle = '#FFF'
      this.ctx.fillRect(0, this.h / 2 - 15, this.w, 30)
      this.ctx.fillStyle = '#000'
      this.ctx.font = '18px sans-serif'
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
    }

    if (this.gameState === GAME_IS.UNSTARTED) {
      const text = `Appuyer sur "espace" pour commencer`
      this.ctx.fillText(text, this.w / 2, this.h / 2)
    } else if (this.gameState === GAME_IS.PAUSED) {
      const text = `Appuyer sur "espace" pour reprendre`
      this.ctx.fillText(text, this.w / 2, this.h / 2)
    } else if (this.gameState === GAME_IS.FINISHED) {
      const text = `Gagné ! Appuyer sur "espace" pour recommencer`
      this.ctx.fillText(text, this.w / 2, this.h / 2)
    } else if (this.gameState === GAME_IS.LOST) {
      const text = `Perdu ! Appuyer sur "espace" pour recommencer`
      this.ctx.fillText(text, this.w / 2, this.h / 2)
    }
  }
}

// make the game and start it
new Mazesteroid('canvas', 'Space Maze', 600, 300).start()
