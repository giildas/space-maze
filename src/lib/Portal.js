import Vector from './Vector'
// import map from './Map'

export default class Portal {
  constructor (x, y, radius) {
    this.pos = new Vector(x, y)
    this.r = radius
    this.innerR = radius * 0.4
    this.angle = 0
    this.isColliding = false

    this.points = []
    for (let i = 0; i < 12; i++) {
      const a = Math.PI * 2 / 12 * i
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
    // ctx.beginPath()
    // ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2)
    // ctx.fill()
    // ctx.closePath()

    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.rotate(this.angle)
    ctx.beginPath()
    ctx.strokeStyle = '#AAA'
    ctx.fillStyle = '#AAA'
    ctx.lineWidth = 3
    ctx.moveTo(this.points[0].x, this.points[0].y)
    for (let i = 0; i < this.points.length; i++) {
      const { x, y } = this.points[i]
      ctx.lineTo(x, y)
      if (i % 2 == 0) ctx.fillRect(x - 8, y - 8, 16, 16)
    }
    ctx.lineTo(this.points[0].x, this.points[0].y)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()

    // dessiner les branches
    if (this.isColliding) {
      ctx.beginPath()
      ctx.strokeStyle = '#0FF'
      ctx.lineWidth = 2

      for (let i = 0; i < 12; i += 2) {
        const { x, y } = this.points[i]
        ctx.save()
        ctx.translate(this.pos.x, this.pos.y)
        ctx.rotate(this.angle)
        ctx.moveTo(x, y)
        ctx.restore()
        ctx.lineTo(this.isColliding.x, this.isColliding.y)
      }

      ctx.closePath()
      ctx.stroke()
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
