import Vector from './Vector'
import map from './Map'

export default class Portal {
  constructor (x, y, radius) {
    this.pos = new Vector(x, y)
    this.r = radius
  }

  collides (ship) {
    return (this.pos.distance(ship.pos) < this.r * 0.75 + ship.r)
  }

  draw (ctx, time) {
    // entre 4 et this.r
    // -1 et 1 // +1 //
    const r = map(Math.cos(time / 500), -1, 1, 2, this.r - this.r / 2)
    const gradient = ctx.createRadialGradient(0, 0, r, 0, 0, this.r)

    // Add three color stops
    gradient.addColorStop(0, '#a9f3fa')
    gradient.addColorStop(1, '#0aaba7')

    // Set the fill style and draw a rectangle
    ctx.save()
    ctx.fillStyle = '#777'
    ctx.translate(this.pos.x, this.pos.y)
    ctx.beginPath()
    ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()

    ctx.beginPath()
    ctx.fillStyle = gradient

    ctx.ellipse(0, 0, this.r * 0.75, this.r * 0.75, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()

    ctx.restore()
  }
}
