import Vector from './Vector'

export default class Ship {

  constructor (width, height, onShoot) {
    this.windowWidth = width
    this.windowHeight = height

    this.pos = new Vector(width/2, height/2)
    this.vel = new Vector(0, 0)
    this.angle = Math.PI
    this.shipAngleOffset = 0

    this.w = 30
    this.h = 15

    this.boost = false

    this.shootAllowed = true
    this.onShoot = onShoot

    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  update () {
    this.pos.add(this.vel)

    if (this.pos.x > this.windowWidth) this.pos.x = 0
    if (this.pos.x < 0) this.pos.x = this.windowWidth
    if (this.pos.y > this.windowHeight) this.pos.y = 0
    if (this.pos.y < 0) this.pos.y = this.windowHeight


    let newAngle = this.angle + this.shipAngleOffset
    this.angle = newAngle
    if (this.boost) {
      let force = Vector.fromAngle(this.angle, 0.15)
      this.vel.add(force)

      if (this.vel.mag > 5) {
        this.vel.setMag(5)
      }
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 32 && this.shootAllowed) {
      this.onShoot(this)
      this.shootAllowed = false
    }

    // left
    if (e.keyCode === 37) this.shipAngleOffset = -0.1
    // right
    if (e.keyCode === 39) this.shipAngleOffset = 0.1
    // up
    if (e.keyCode === 38) this.boost = true
  }

  onKeyUp(e) {
    if (e.keyCode === 37 || e.keyCode === 39) this.shipAngleOffset = 0
    if (e.keyCode === 38) this.boost = false
    if (e.keyCode === 32) this.shootAllowed = true
  }

  draw (ctx) {
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 1;

    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.rotate(this.angle)
    ctx.beginPath();
      ctx.moveTo(-this.w/2, -this.h/2);
      ctx.lineTo(this.w/2, 0);
      ctx.lineTo(-this.w/2, this.h/2);
      ctx.lineTo(-this.w/2, -this.h/2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    if (this.boost) {
      ctx.fillStyle = '#f4aa39';
      ctx.beginPath();
        ctx.moveTo(-this.w/2, -this.h/4);
        ctx.lineTo(-this.w/2-10, 0);
        ctx.lineTo(-this.w/2, this.h/4);
        ctx.fill();
       ctx.closePath();
      }
    ctx.restore()
  }
}
