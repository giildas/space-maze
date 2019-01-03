import Vector from './Vector'

export default class Laser {
  constructor (width, height, x, y, angle) {
    this.windowWidth = width
    this.windowHeight = height

    this.pos = new Vector(x, y)
    this.angle = angle
    this.vel = Vector.fromAngle(angle, 10)
  }

  get outOfScreen() {
    return (
      this.pos.x > this.windowWidth ||
      this.pos.x < 0 ||
      this.pos.y > this.windowHeight ||
      this.pos.y < 0
    )
  }

  hits (asteroid) {
    return (this.pos.distance(asteroid.pos) < asteroid.r)
  }

  update() {
    this.pos.add(this.vel)
  }

  draw (ctx) {
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.rotate(this.angle)
      ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(5, 0);
      ctx.closePath();
    ctx.stroke();
    ctx.restore()
  }

}
