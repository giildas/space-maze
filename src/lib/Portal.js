import Vector from './Vector'

export default class Portal {
  constructor (x, y, radius) {
    this.pos = new Vector(x, y)
    this.r = radius
  }

  collides (ship) {
    return (this.pos.distance(ship.pos) < this.r + ship.r)
  }

  draw (ctx) {
    ctx.save()
    ctx.fillStyle = '#0FF'
    ctx.strokeStyle = '#DDD'
    ctx.lineWidth = this.r / 4

    ctx.translate(this.pos.x, this.pos.y)
    ctx.beginPath()
    ctx.ellipse(0, 0, this.r - this.r / 4, this.r - this.r / 4, 0, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
}
