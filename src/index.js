// TODO
// ship on top left
// generate a maze
// ship / wall collision detection

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

newGame()

function newGame () {
  let cellW = 60 // ideally
  const cols = Math.floor(w / cellW)
  cellW = w / cols // we change cellW so it's ok with canvas w
  const rows = Math.floor(h / cellW)
  const cellH = h / rows
  const maze = new Maze(cols, rows, cellW, cellH)

  const ship = new Ship(w, h, cellW / 2, cellH / 2, (s) => {
    console.log('space pressed')
  })

  const portal = new Portal(w - cellW / 2, h - cellW / 2, cellW / 2)

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

  maze.draw(ctx)

  portal.draw(ctx)

  ship.update()
  ship.draw(ctx)

  requestAnimationFrame(() => {
    gameLoop(ship, maze, portal)
  })
}
