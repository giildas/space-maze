import Vector from './Vector'

export default class Ship {
  constructor (width, height, onShoot) {
    this.windowWidth = width
    this.windowHeight = height

    this.pos = new Vector(width / 2, height / 2)
    this.vel = new Vector(0, 0)
    this.angle = Math.PI
    this.shipAngleOffset = 0

    this.r = 15
    // we will draw the ship a bit bigger so collision seem more ok
    this.drawR = this.r * 1.3

    this.boost = false

    this.shootAllowed = true
    this.onShoot = onShoot

    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  update () {
    this.pos.add(this.vel)

    if (this.pos.x > this.windowWidth + this.r) this.pos.x = -this.r
    if (this.pos.x < -this.r) this.pos.x = this.windowWidth + this.r
    if (this.pos.y > this.windowHeight + this.r) this.pos.y = -this.r
    if (this.pos.y < -this.r) this.pos.y = this.windowHeight + this.r

    const newAngle = this.angle + this.shipAngleOffset
    this.angle = newAngle
    if (this.boost) {
      const force = Vector.fromAngle(this.angle, 0.15)
      this.vel.add(force)

      if (this.vel.mag > 5) {
        this.vel.setMag(5)
      }
    }
  }

  onKeyDown (e) {
    if (e.keyCode === 32 && this.shootAllowed) {
      this.onShoot(this)
      this.shootAllowed = false
    }
    if (e.keyCode === 37) this.shipAngleOffset = -0.1
    if (e.keyCode === 39) this.shipAngleOffset = 0.1
    if (e.keyCode === 38) this.boost = true
  }

  onKeyUp (e) {
    if (e.keyCode === 37 || e.keyCode === 39) this.shipAngleOffset = 0
    if (e.keyCode === 38) this.boost = false
    if (e.keyCode === 32) this.shootAllowed = true
  }

  draw (ctx) {
    this._drawShip(ctx, this.pos.x, this.pos.y)

    if (this.boost) {
      this._drawTriangle(ctx, this.pos.x, this.pos.y, 1, '#ff860d')
      this._drawTriangle(ctx, this.pos.x, this.pos.y, 0.4, '#FFF')
    }
  }

  _drawShip (ctx, x, y) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = '#c89bc5'
    ctx.strokeStyle = '#FFF'
    ctx.lineWidth = 1

    ctx.rotate(this.angle)
    ctx.beginPath()
    ctx.moveTo(-this.drawR, -this.drawR / 2)
    ctx.lineTo(this.drawR, 0)
    ctx.lineTo(-this.drawR, this.drawR / 2)
    ctx.lineTo(-this.drawR, -this.drawR / 4)
    ctx.closePath()
    ctx.fill()
    if (window.options.collisionsDebugCircle) {
      ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.restore()
  }

  _drawTriangle (ctx, x, y, scale, color) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(this.angle)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(-this.drawR, -this.drawR / 4 * scale)
    ctx.lineTo(-this.drawR - this.drawR / 1.5 * scale, 0)
    ctx.lineTo(-this.drawR, this.drawR / 4 * scale)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}
