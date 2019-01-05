import Vector from './Vector'

export default class Portal {
  constructor (x, y, radius) {
    this.pos = new Vector(x, y)
    this.r = radius
  }

  collides (ship) {
    return (this.pos.distance(ship.pos) < this.r * 0.6 + ship.r)
  }

  draw (ctx) {
    // const vortex = this._createVortex(ctx)
    ctx.save()
    ctx.fillStyle = '#0FF'
    ctx.strokeStyle = '#777'
    ctx.lineWidth = this.r / 4
    ctx.translate(this.pos.x, this.pos.y)
    ctx.beginPath()
    ctx.ellipse(0, 0, this.r * 0.75, this.r * 0.75, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }

  // TODO !
  _createVortex (ctx) {
    const r = this.r * 1.5
    const img = ctx.createImageData(r, r)
    // let centerI = img.data.length / 2

    for (let i = 0; i < img.data.length; i += 4) {
      // Modify pixel data
      const alpha = 255

      img.data[i + 0] = Math.floor(Math.random() * 120)
      img.data[i + 1] = Math.floor(Math.random() * 190)
      img.data[i + 2] = Math.floor(Math.random() * 255)
      img.data[i + 3] = alpha// Math.floor(Math.random() * 255)
    }
    return img
  }
}
