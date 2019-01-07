import Vector from './Vector'
import Explosion from './Explosion'

export default class Ship {
  constructor (x, y, radius) {
    this.r = radius

    this.initialPos = new Vector(x, y)
    this.pos = new Vector(x, y)
    this.vel = new Vector(0, 0)

    this.angle = 0
    this.shipAngleOffset = 0

    this.boost = 0

    this.explosion = null
  }

  startTurning (offset) { this.shipAngleOffset = offset }
  stopTurning () { this.shipAngleOffset = 0 }
  startBoost (boostPower) { this.boost = boostPower }
  stopBoost () { this.boost = 0 }

  resetPos () {
    if (!this.explosion) return // no reset of the ship while it's not exploding

    this.explosion = null
    this.pos = new Vector(this.initialPos.x, this.initialPos.y)
    this.vel = new Vector(0, 0)
    this.angle = 0
    this.shipAngleOffset = 0

    this.boost = 0
    this.enteringPortal = false
  }

  update () {
    if (this.explosion) return

    // common update operation
    this.pos.add(this.vel)
    const newAngle = this.angle + this.shipAngleOffset
    this.angle = newAngle

    if (this.boost > 0) {
      const force = Vector.fromAngle(this.angle, this.boost)
      this.vel.add(force)
      this.vel.constrain(3)
    }

    if (this.enteringPortal) {
      this.r -= 0.1
      this.r = Math.max(this.r, 0.1)
    }
  }

  explode (cb) {
    if (!this.explosion) {
      const movmentDir = this.vel.angle

      const speed = this.vel.mag
      this.explosion = new Explosion(this.pos.x, this.pos.y, movmentDir, speed, this.r, cb)
    }
  }

  enterPortal (portal, cb) {
    if (this.enteringPortal) return

    this.enteringPortal = true
    this.portalCb = cb
    this.portalPos = portal.pos

    const p = this.pos.clone()
    p.subtract(portal.pos)
    p.mult(-1)
    p.setMag(1)
    this.vel = p

    setTimeout(cb, 750)
  }

  draw (ctx) {
    if (this.explosion) {
      this.explosion.draw(ctx)
    } else {
      this._drawShip(ctx, this.pos.x, this.pos.y)
      this._drawBoost(ctx, this.pos.x, this.pos.y, 2, '#ff860d')
    }
  }

  _drawShip (ctx, x, y) {
    ctx.save()
    ctx.fillStyle = '#999'
    ctx.translate(x, y)
    ctx.rotate(this.angle)
    ctx.beginPath()
    ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()

    ctx.beginPath()
    ctx.strokeStyle = '#0FF'
    ctx.lineWidth = this.r / 4
    const r = this.r * 0.5
    ctx.ellipse(0, 0, r, r, 0, -Math.PI / 4, Math.PI / 4)

    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }

  _drawBoost (ctx, x, y, scale, color) {
    if (this.boost === 0) return

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(this.angle)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(-this.r, -this.r / 4 * scale)
    ctx.lineTo(-this.r - this.r / 1.5 * scale, 0)
    ctx.lineTo(-this.r, this.r / 4 * scale)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}
