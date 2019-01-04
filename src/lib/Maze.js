import Cell from './Cell.js'

export default class Maze {
  constructor (cols, rows, cellW, cellH) {
    this.cols = cols
    this.rows = rows

    this.grid = []
    this.stack = []

    // on remplit la grille
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var cell = new Cell(i, j, cellW, cellH)
        this.grid.push(cell)
      }
    }

    // première cellule
    this.current = this.grid[0]
    // generation du labyrinthe
    let mazeDone = false
    while (!mazeDone) {
      mazeDone = this.update()
    }
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

  update () {
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
      this.current = this.stack.pop()
    }

    return this.stack.length === 0
  }

  draw (ctx) {
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i].draw(ctx)
    }
  }
}

