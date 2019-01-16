export default class Cell {
  constructor (i, j, cellW, cellH, index) {
    this.i = i
    this.j = j
    this.cellW = cellW
    this.cellH = cellH
    // this.size = size
    this.wallWidth = 1

    this.index = index

    this.walls = {
      n: true,
      e: true,
      s: true,
      w: true
    }
    this.visited = false
  }

  collides (ship) {
    const { x, y } = ship.pos
    const r = ship.r
    const cellX = this.i * this.cellW
    const cellY = this.j * this.cellH

    const shipInCell = (x + r > cellX && x - r < cellX + this.cellW) && (y + r > cellY && y - r < cellY + this.cellH)
    if (!shipInCell) return false

    return (
      (this.walls.e && x + r > cellX + this.cellW) ||
      (this.walls.w && x - r < cellX) ||
      (this.walls.s && y + r > cellY + this.cellH) ||
      (this.walls.n && y - r < cellY)
    )
  }

  draw (ctx) {
    const x = this.i * this.cellW
    const y = this.j * this.cellH

    ctx.strokeStyle = '#FFF'
    ctx.lineWidth = this.wallWidth

    if (this.walls.n) {
      this._drawWall(ctx, x, y, x + this.cellW, y)
    }
    if (this.walls.e) {
      this._drawWall(ctx, x + this.cellW, y, x + this.cellW, y + this.cellH)
    }
    if (this.walls.s) {
      this._drawWall(ctx, x + this.cellW, y + this.cellH, x, y + this.cellH)
    }
    if (this.walls.w) {
      this._drawWall(ctx, x, y + this.cellH, x, y)
    }
    // ctx.fillStyle = '#FFF'
    // ctx.fillText(this.index, x + this.cellW / 2, y + this.cellH / 2)

    // if (this.visited) {
    //   ctx.fillStyle = 'rgba(255, 0, 255, 100)'
    //   ctx.fillRect(x, y, this.size, this.size)
    // }
  }

  _drawWall (ctx, a, b, c, d) {
    ctx.beginPath()
    ctx.moveTo(a, b)
    ctx.lineTo(c, d)
    ctx.stroke()
    ctx.closePath()
  }
}
