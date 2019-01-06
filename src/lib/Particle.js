import Vector from './Vector'

export default class Particle {
  constructor (x, y, angle, initialSpeed, damping, size, color) {
    this.pos = new Vector(x, y)
    this.initPos = new Vector(x, y)

    this.vel = Vector.fromAngle(angle, initialSpeed)
    this.damping = damping

    this.angle = angle
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
    ctx.fillRect(-2.5, -5, 5, 10)
    ctx.restore()
  }
}
