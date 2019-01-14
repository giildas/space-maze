import Vector from './Vector'
const nbPoints = 10

export default class Portal {
  constructor (x, y, radius) {
    this.pos = new Vector(x, y)
    this.r = radius
    this.innerR = radius * 0.3
    this.angle = 0
    this.isColliding = false

    this.points = []
    for (let i = 0; i < nbPoints; i++) {
      const a = Math.PI * 2 / nbPoints * i
      const r = i % 2 === 0 ? this.r : this.innerR + 3
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      this.points.push({ x, y })
    }
  }

  collides (ship) {
    const collides = (this.pos.distance(ship.pos) < this.innerR + ship.r)
    if (collides) {
      this.isColliding = ship.pos
    } else {
      this.isColliding = false
    }
    return collides
  }

  draw (ctx, time) {
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.rotate(this.angle)
    ctx.beginPath()
    ctx.strokeStyle = '#AAA'
    ctx.fillStyle = '#AAA'
    ctx.lineWidth = 3
    for (let i = 0; i < this.points.length; i++) {
      const { x, y } = this.points[i]
      ctx.translate(x, y)
      ctx.lineTo(0, 0)

      if (i % 2 === 0) {
        ctx.rotate(Math.PI * 2 * i / this.points.length)
        ctx.fillRect(-6, -6, 12, 12)
        ctx.rotate(-Math.PI * 2 * i / this.points.length)
      }
      ctx.translate(-x, -y)
    }
    ctx.closePath()
    ctx.stroke()
    ctx.restore()

    // dessiner les rayons
    if (this.isColliding) {
      ctx.lineWidth = 2

      for (let i = 1; i < this.points.length; i += 2) {
        const { x, y } = this.points[i]
        ctx.save()
        ctx.translate(this.pos.x, this.pos.y)
        ctx.rotate(this.angle)
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.restore()
        ctx.strokeStyle = i % 2 == 0 ? '#FF00FF' : '#0FF'
        ctx.lineTo(this.isColliding.x, this.isColliding.y) // ship pos
        ctx.stroke()
      }
    }

    // const r = map(Math.cos(time / 500), -1, 1, 2, this.r - this.r / 2)
    // const gradient = ctx.createRadialGradient(0, 0, r, 0, 0, this.r)
    // gradient.addColorStop(0, '#a9f3fa')
    // gradient.addColorStop(1, '#0aaba7')
    // ctx.beginPath()
    // ctx.fillStyle = gradient
    // ctx.ellipse(0, 0, this.innerR, this.innerR, 0, 0, Math.PI * 2)
    // ctx.fill()
    // ctx.closePath()

    ctx.restore()

    this.angle += 0.002
  }
}
