import Vector from './Vector'

export default class Asteroid {
  constructor (w, h, x, y, r = 30, divided = false) {
    this.windowWidth = w
    this.windowHeight = h

    if (!x || !y) {
      // spawn only on the "edges", so no asteroid appears on top of ship
      const coords = this._createNewXYCoords()
      x = coords.x
      y = coords.y
    }

    this.pos = new Vector(x, y)
    this.r = r

    this.angle = Math.random() * Math.PI
    this.rotation = (Math.random() - 0.5) / 10

    this.divided = divided
    // random speed between .3 and 1.3
    const velMag = Math.random() + 0.3
    this.vel = Vector.fromAngle(Math.random() * Math.PI * 2, velMag)

    this.nbPoints = Math.floor(Math.random() * 10) + 5
    this.offsets = []
    for (let i = 0; i < this.nbPoints; i++) {
      this.offsets[i] = Math.random() * r - r / 2
    }
  }

  _createNewXYCoords () {
    let x = Math.random() * this.windowWidth
    let y = Math.random() * this.windowHeight
    while (!(
      (x < this.windowWidth / 3 || x > this.windowWidth / 3 * 2) &&
      (y < this.windowHeight / 3 || y > this.windowHeight / 3 * 2)
    )) {
      x = Math.random() * this.windowWidth
      y = Math.random() * this.windowHeight
    }
    return { x, y }
  }

  hits (object) {
    return (this.pos.distance(object.pos) < this.r + object.r)
  }

  update () {
    this.pos.add(this.vel)

    if (this.pos.x > this.windowWidth + this.r) this.pos.x = -this.r
    if (this.pos.x < -this.r) this.pos.x = this.windowWidth + this.r
    if (this.pos.y > this.windowHeight + this.r) this.pos.y = -this.r
    if (this.pos.y < -this.r) this.pos.y = this.windowHeight + this.r

    this.angle += this.rotation
  }

  draw (ctx) {
    ctx.fillStyle = '#FFF'
    ctx.strokeStyle = '#FFF'
    ctx.lineWidth = 1
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.rotate(this.angle)
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

    ctx.fill()
    ctx.closePath()

    if (window.options.collisionsDebugCircle) {
      ctx.strokeStyle = '#F00'
      ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.restore()
  }
}
