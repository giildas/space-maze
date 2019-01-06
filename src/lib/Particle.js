import Vector from './Vector'

export default class Particle {
  constructor (x, y, angle, initialSpeed, damping, size, color) {
    this.pos = new Vector(x, y)
    this.initPos = new Vector(x, y)

    this.vel = Vector.fromAngle(angle, initialSpeed)
    // console.log('this.vel', this.vel)
    this.damping = damping

    this.size = size
    this.color = color

    this.rota = Math.random() * 2 * Math.PI
    this.rotaOffset = (Math.random() - 0.5) / 5
  }

  update () {
    this.pos.add(this.vel)
    this.vel.mult(this.damping)
    this.rota += this.rotaOffset
  }

  draw (ctx) {
    ctx.fillStyle = this.color
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.rotate(this.rota)
    ctx.fillRect(-this.size / 2, -this.size, this.size, this.size * 2)
    ctx.restore()
  }
}
