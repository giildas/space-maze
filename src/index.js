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
import ShipFrontLight from './ShipFrontLight'
import Maze from './Maze'
import Portal from './Portal'
import Vector from './lib/Vector'

const OPTIONS = {
  shipAngleOffset: 8, // speed of turning
  shipBoostPower: 10, // the lower the harder
  debug: true,
  wallCollision: false,
  portalCollision: true,
  lastLevel: 4 // level x will be the last one
}

const GAME_IS = {
  UNSTARTED: 0,
  RUNNING: 1,
  PAUSED: 2,
  FINISHED: 3,
  LOST: 4
}

class Mazesteroid extends canvasGameEngine {
  setup () {
    // game state
    this.level = 1
    this.gameState = GAME_IS.UNSTARTED
    this.nextGameState = this.gameState
    this.newLevel()

    // game events
    const keyboard = new Keys(this.canvas, OPTIONS.debug)

    keyboard.addKeysAction(37, () => this.ship.startTurning(-OPTIONS.shipAngleOffset), () => this.ship.stopTurning())
    keyboard.addKeysAction(39, () => this.ship.startTurning(OPTIONS.shipAngleOffset), () => this.ship.stopTurning())
    keyboard.addKeysAction(38, () => {
      if (this.gameState === GAME_IS.RUNNING) this.ship.startBoost(OPTIONS.shipBoostPower)
    }, () => this.ship.stopBoost())

    if (OPTIONS.debug) {
      keyboard.addKeyDownAction(82, () => this.ship.resetPos()) // r => reset ship to start of level
      keyboard.addKeyDownAction(65, () => { this.ship.angle += Math.PI / 4 }) // a => turn ship 45deg
      keyboard.addKeyDownAction(66, () => { this.ship.vel = new Vector() }) // b => block ship position
    }

    keyboard.addKeyDownAction(32, () => { // space
      // some logic
      switch (this.gameState) {
        case GAME_IS.UNSTARTED:
          this.nextGameState = GAME_IS.RUNNING
          break
        case GAME_IS.RUNNING:
          this.nextGameState = GAME_IS.PAUSED
          break
        case GAME_IS.PAUSED:
          this.nextGameState = GAME_IS.RUNNING
          break
        case GAME_IS.FINISHED:
        case GAME_IS.LOST:
          this.nextGameState = GAME_IS.RUNNING
          this.level = 1
          this.newLevel()
          break
      }
    })
    keyboard.addMouseDownAction((e) => this.ship.resetPos(e.offsetX, e.offsetY))
  }

  newLevel () {
    // maze grid size calculation
    const cols = this.level + 2
    const cellW = this.w / cols
    let cellH = cellW
    const rows = Math.ceil(this.h / cellH)
    cellH = this.h / rows

    // create maze
    this.maze = new Maze(cols, rows, cellW, cellH)

    // create portal
    const portalX = this.maze.furthestCellCoords.i * cellW + cellW / 2
    const portalY = this.maze.furthestCellCoords.j * cellH + cellH / 2
    const minCellDim = Math.min(cellW, cellH)

    const isLastLevel = OPTIONS.lastLevel === this.level // draw a red portal
    this.portal = new Portal(portalX, portalY, minCellDim / 2.5, isLastLevel)

    // create ship & ship frontlight
    this.shipFrontLight = new ShipFrontLight(this.w, this.h)
    this.ship = new Ship(cellW / 2, cellH / 2, 10) // always starts at top left
  }

  _writeText (text) {
    this.ctx.fillStyle = '#FFF'
    this.ctx.fillRect(0, this.h / 2 - 15, this.w, 30)
    this.ctx.fillStyle = '#000'
    this.ctx.font = '18px sans-serif'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(text, this.w / 2, this.h / 2)
  }

  loop (elapsedTime) {
    this.ctx.fillStyle = '#111'
    this.ctx.fillRect(0, 0, this.w, this.h)

    this.maze.draw(this.ctx)
    this.portal.draw(this.ctx)
    this.ship.draw(this.ctx, this.shipFrontLight) // the ship is responsible for drawing his frontlight

    const text = `Level: ${this.level}`
    this.ctx.font = '12px sans-serif'
    this.ctx.fillStyle = '#FFF'
    this.ctx.textAlign = 'left'
    this.ctx.fillText(text, 15, 15)

    switch (this.gameState) {
      case GAME_IS.RUNNING: {
        this.ship.update(elapsedTime)
        this.shipFrontLight.update(this.ship, this.maze)

        const collisionWithWall = OPTIONS.wallCollision ? this.maze.collides(this.ship) : this.ship.edges(this.w, this.h)
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
              this.nextGameState = GAME_IS.FINISHED
            } else {
              this.nextGameState = GAME_IS.UNSTARTED
              this.level += 1
              this.newLevel()
            }
          })
        }
        break
      }
      case GAME_IS.UNSTARTED:
        this._writeText(`Appuyer sur "espace" pour commencer`)
        break
      case GAME_IS.PAUSED:
        this._writeText(`Appuyer sur "espace" pour reprendre`)
        break
      case GAME_IS.FINISHED:
        this._writeText(`Gagné ! Appuyer sur "espace" pour recommencer`)
        break
      case GAME_IS.LOST:
        this._writeText(`Perdu ! Appuyer sur "espace" pour recommencer`)
        break
    }

    this.gameState = this.nextGameState
  } // loop
}

// make the game and start it
new Mazesteroid('canvas', 'Space Maze', 600, 300).start()
