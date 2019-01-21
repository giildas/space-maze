import Cell from './Cell.js'
import Vector from './lib/Vector'

export default class Maze {
  constructor (cols, rows, cellW, cellH) {
    this.cols = cols
    this.rows = rows
    this.cellW = cellW
    this.cellH = cellH

    this.grid = []
    this.stack = []

    this.longestStack = 0
    this.furthestCellCoords = null

    let index = 0
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var cell = new Cell(i, j, cellW, cellH, index)
        this.grid.push(cell)
        index++
      }
    }

    this.current = this.grid[0]
    let mazeDone = false
    while (!mazeDone) {
      mazeDone = this.nextBuildStep()
    }

    console.log(this.grid)

    // ici recuperer les edges des cellules
    // TODO : merge edges !!! (east wall & west wall of 2 adjacent cells)
    this.edges = []
    this.grid.forEach(cell => {
      if (cell.walls.n) this._addEdge(cell, 0, 0, 1, 0)
      if (cell.walls.s) this._addEdge(cell, 0, 1, 1, 1)
      if (cell.walls.w) this._addEdge(cell, 0, 0, 0, 1)
      if (cell.walls.e) this._addEdge(cell, 1, 0, 1, 1)
    })

    // remove doubles
    const newEdges = this.edges.filter((edge, index) => {
      let isUnique = true
      this.edges.forEach((_e, _i) => {
        if (index < _i) {
          if (
            edge[0].x === _e[0].x &&
            edge[0].y === _e[0].y &&
            edge[1].y === _e[1].y &&
            edge[1].y === _e[1].y
          ) {
            isUnique = false
          }
        }
      })
      return isUnique
    })
    this.edges = newEdges
  }

  _addEdge (cell, a, b, c, d) {
    const x1 = cell.i + a
    const y1 = cell.j + b
    const x2 = cell.i + c
    const y2 = cell.j + d

    this.edges.push([
      new Vector(x1 * this.cellW, y1 * this.cellH),
      new Vector(x2 * this.cellW, y2 * this.cellH)
    ])
  }

  checkNeighbors () {
    const { i, j } = this.current
    const neighbors = []

    const top = this.grid[this.index(i, j - 1)]
    const right = this.grid[this.index(i + 1, j)]
    const bottom = this.grid[this.index(i, j + 1)]
    const left = this.grid[this.index(i - 1, j)]

    if (top && !top.visited) {
      neighbors.push(top)
    }
    if (right && !right.visited) {
      neighbors.push(right)
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom)
    }
    if (left && !left.visited) {
      neighbors.push(left)
    }

    if (neighbors.length > 0) {
      const r = Math.floor(Math.random() * neighbors.length)
      return neighbors[r]
    } else {
      return undefined
    }
  }

  index (i, j) {
    if (i < 0 || j < 0 || i > this.cols - 1 || j > this.rows - 1) {
      return -1
    }
    return i + j * this.cols
  }

  removeWalls (a, b) {
    var x = a.i - b.i
    if (x === 1) {
      a.walls.w = false
      b.walls.e = false
    } else if (x === -1) {
      a.walls.e = false
      b.walls.w = false
    }
    var y = a.j - b.j
    if (y === 1) {
      a.walls.n = false
      b.walls.s = false
    } else if (y === -1) {
      a.walls.s = false
      b.walls.n = false
    }
  }

  nextBuildStep () {
    this.current.visited = true

    // STEP 1
    var next = this.checkNeighbors(this.current.i, this.current.j)
    if (next) {
      next.visited = true
      // STEP 2
      this.stack.push(this.current)

      // STEP 3
      this.removeWalls(this.current, next)
      // STEP 4
      this.current = next
    } else if (this.stack.length > 0) {
      if (this.stack.length > this.longestStack) {
        this.longestStack = this.stack.length
        this.furthestCellCoords = { i: this.current.i, j: this.current.j }
      }
      this.current = this.stack.pop()
    }

    return this.stack.length === 0
  }

  collides (ship) {
    for (let i = 0; i < this.grid.length; i++) {
      const collision = this.grid[i].collides(ship)
      if (collision) {
        return true
      }
    }
    return false
  }

  draw (ctx) {
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i].draw(ctx)
    }

    // dessin des edges (debug)
    this.edges.forEach(edge => {
      ctx.beginPath()
      ctx.fillStyle = '#F00'
      ctx.ellipse(edge[0].x, edge[0].y, 5, 5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.fillStyle = '#00F'
      ctx.ellipse(edge[1].x, edge[1].y, 5, 5, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.strokeStyle = '#0F0'
      ctx.lineWidth = 2

      ctx.moveTo(edge[0].x, edge[0].y)
      ctx.lineTo(edge[1].x, edge[1].y)
      ctx.stroke()
    })

    ctx.save()
    ctx.fillStyle = '#F00'
    ctx.beginPath()
    ctx.translate(this.furthestCellCoords.i * this.cellW, this.furthestCellCoords.j * this.cellH)
    ctx.ellipse(this.cellW / 2, this.cellH / 2, 10, 10, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
}

