export default class Portal {
  constructor (x, y, radius) {
    this.x = x
    this.y = y
    this.r = radius
  }

  draw (ctx) {
    ctx.save()
    ctx.fillStyle = '#0FF'
    ctx.strokeStyle = '#DDD'
    ctx.lineWidth = this.r / 4

    ctx.translate(this.x, this.y)
    ctx.beginPath()
    ctx.ellipse(0, 0, this.r - this.r / 4, this.r - this.r / 4, 0, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
}
