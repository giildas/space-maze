import Vector from './Vector'

export default class Asteroid {
  constructor (w, h, x, y, r = 30, divided = false) {
    this.windowWidth = w
    this.windowHeight = h

    if (!x) x = Math.random() * w
    if (!y) y = Math.random() * h

    this.pos = new Vector(x, y)
    this.r = r

    this.divided = divided
    this.vel = Vector.fromAngle(Math.random() * Math.PI * 2, Math.random())

    this.nbPoints = Math.floor(Math.random() * 10) + 5
    this.offsets = []
    for (let i = 0; i < this.nbPoints; i++) {
      this.offsets[i] = Math.random() * r - r / 2
    }
  }

  hits (object) {
    return (this.pos.distance(object.pos) < this.r + object.r)
  }

  update () {
    this.pos.add(this.vel)
    if (this.pos.x > this.windowWidth) this.pos.x = 0
    if (this.pos.x < 0) this.pos.x = this.windowWidth
    if (this.pos.y > this.windowHeight) this.pos.y = 0
    if (this.pos.y < 0) this.pos.y = this.windowHeight
  }

  draw (ctx) {
    ctx.fillStyle = '#FFF'
    ctx.lineWidth = 1
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.beginPath()
    for (let i = 0; i < this.nbPoints; i++) {
      const a = i / this.nbPoints * Math.PI * 2
      const r = this.r + this.offsets[i]
      const x = r * Math.cos(a)
      const y = r * Math.sin(a)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}
