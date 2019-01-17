import Vector from './lib/Vector'
import Explosion from './Explosion'

export default class Ship {
  constructor (x, y, radius) {
    this.r = radius

    this.initialPos = new Vector(x, y)
    this.acceleration = new Vector(0, 0)
    this.pos = new Vector(x, y)
    this.vel = new Vector(0, 0)

    this.angle = 0
    this.shipAngleOffset = 0

    this.boost = 0

    this.explosion = null

    this.frontLightAngle = Math.PI / 6 // that is half the angle actually
  }

  startTurning (offset) { this.shipAngleOffset = offset }
  stopTurning () { this.shipAngleOffset = 0 }
  startBoost (boostPower) { this.boost = boostPower }
  stopBoost () { this.boost = 0 }

  resetPos () {
    // if (!this.explosion) return // no reset of the ship while it's not exploding

    this.explosion = null
    this.pos = new Vector(this.initialPos.x, this.initialPos.y)
    this.vel = new Vector(0, 0)
    this.angle = 0
    this.shipAngleOffset = 0

    this.boost = 0
    this.enteringPortal = false

    this.acceleration = new Vector(0, 0)
  }

  update (deltaTime) {
    if (this.explosion) return

    // update operation
    // this.pos = position du vaisseau
    // acceleration : ajouté à la vélocité, doit etre proportionnel à deltatime
    // this.vel: vitesse
    //    * ajouté à chaque frame (si framerate 60, doit etre 3x inf à framerate 20 ...)
    //    * constraint à une vitesse max, si framerate
    //

    const newAngle = this.angle + this.shipAngleOffset * 0.001 * deltaTime
    this.angle = newAngle

    if (this.boost > 0 && !this.enteringPortal) {
      this.acceleration = Vector.fromAngle(this.angle, this.boost * 0.001 * deltaTime)
    } else {
      this.acceleration = new Vector(0, 0)
    }
    this.vel.add(this.acceleration)
    this.vel.constrain(0.2 * deltaTime)
    this.pos.add(this.vel)

    if (this.enteringPortal) {
      this.r -= 0.1
      this.r = Math.max(this.r, 0.1)
    }
  }

  edges (w, h) {
    if (this.pos.x > w + this.r) this.pos.x = 0
    if (this.pos.y > h + this.r) this.pos.y = 0
    if (this.pos.x < -this.r) this.pos.x = w + this.r
    if (this.pos.y < -this.r + this.r) this.pos.y = h + this.r
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

    setTimeout(cb, 500)
  }

  draw (ctx) {
    if (this.explosion) {
      this.explosion.draw(ctx)
    } else {
      this._drawFrontLight(ctx)
      this._drawShip(ctx)
      this._drawBoost(ctx)
    }
  }

  _drawShip (ctx) {
    ctx.save()
    ctx.fillStyle = '#999'
    ctx.translate(this.pos.x, this.pos.y)
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

  _drawBoost (ctx) { //, x, y, scale, color) {
    if (this.boost === 0) return
    const scale = 2
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.rotate(this.angle)
    ctx.fillStyle = '#ff860d'
    ctx.beginPath()
    ctx.moveTo(-this.r, -this.r / 4 * scale)
    ctx.lineTo(-this.r - this.r / 1.5 * scale, 0)
    ctx.lineTo(-this.r, this.r / 4 * scale)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  _drawFrontLight (ctx) {
    // make a gradient
    const x2 = this.pos.x + Math.cos(this.angle) * 250
    const y2 = this.pos.y + Math.sin(this.angle) * 250
    const gradient = ctx.createLinearGradient(this.pos.x, this.pos.y, x2, y2)
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.4)')
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0.1)')

    ctx.save()
    ctx.fillStyle = gradient
    // ctx.translate(this.pos.x, this.pos.y)
    ctx.beginPath()

    let x = this.pos.x + Math.cos(this.angle - this.frontLightAngle) * 600
    let y = this.pos.y + Math.sin(this.angle - this.frontLightAngle) * 600
    ctx.lineTo(x, y)

    x = this.pos.x + Math.cos(this.angle + this.frontLightAngle) * 600
    y = this.pos.y + Math.sin(this.angle + this.frontLightAngle) * 600
    ctx.lineTo(x, y)

    ctx.lineTo(this.pos.x, this.pos.y)

    ctx.closePath()
    ctx.fill()
    ctx.restore()

    // ctx.fillStyle = '#FF0'
    // ctx.fillRect(this.pos.x, this.pos.y, 5, 5)
    // ctx.fillRect(x2, y2, 5, 5)
  }
}
