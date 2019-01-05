import Vector from './Vector'

export default class Particle {
  constructor (x, y, angle, initialSpeed, damping) {
    this.pos = new Vector(x, y)
    // console.log('angle', angle)
    this.vel = Vector.fromAngle(angle, initialSpeed)
    this.damping = damping

    this.size = Math.random() * 2 + 1
  }

  update () {
    this.pos.add(this.vel)
    this.vel.mult(this.damping)
  }

  draw (ctx) {
    console.log('part.update')
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)

    ctx.fillStyle = '#CCC'
    ctx.fillRect(-this.size, -this.size, this.size, this.size)

    ctx.restore()
  }
}
