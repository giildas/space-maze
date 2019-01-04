export default class Cell {
  constructor (i, j, cellW, cellH) {
    this.i = i
    this.j = j
    this.cellW = cellW
    this.cellH = cellH
    // this.size = size
    this.wallWidth = 1

    this.walls = {
      n: true,
      e: true,
      s: true,
      w: true
    }
    this.visited = false
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
