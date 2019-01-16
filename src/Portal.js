import Vector from './lib/Vector'
import { map } from './lib/Utils'
const nbPoints = 10

export default class Portal {
  constructor (x, y, radius, isLastLevel) {
    this.pos = new Vector(x, y)

    this.innerRadius = radius * 0.7
    this.strokeWidth = radius - this.innerRadius
    this.r = this.innerRadius + (this.strokeWidth / 2)

    this.angle = 0
    this.isColliding = false
    this.isLastLevel = isLastLevel
  }

  collides (ship) {
    const collides = (this.pos.distance(ship.pos) < this.innerRadius + ship.r)
    if (collides) {
      this.isColliding = ship.pos
    } else {
      this.isColliding = false
    }
    return collides
  }

  draw (ctx) {
    ctx.strokeStyle = '#aaa'
    ctx.lineWidth = this.strokeWidth

    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)

    const r = map(Math.sin(performance.now() / 500), -1, 1, 2, this.r - this.r / 2)
    const gradient = ctx.createRadialGradient(0, 0, r, 0, 0, this.r)
    gradient.addColorStop(0, this.isLastLevel ? '#ed7a7d' : '#a9f3fa')
    gradient.addColorStop(1, this.isLastLevel ? '#bb2027' : '#0aaba7')
    ctx.fillStyle = gradient

    ctx.beginPath()
    ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }
}
