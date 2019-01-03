import Vector from "./Vector";

export default class Asteroid {

  constructor(w, h, x , y, r = 30, divided = false ) {
    this.windowWidth = w
    this.windowHeight = h

    if (!x) x = Math.random() * w
    if (!y) y = Math.random() * h

    this.pos = new Vector(x, y)
    this.r = r


    this.divided = divided
    this.vel = Vector.fromAngle(Math.random() * Math.PI * 2, Math.random() )
  }


  update() {
    this.pos.add(this.vel)
    if (this.pos.x > this.windowWidth) this.pos.x = 0
    if (this.pos.x < 0) this.pos.x = this.windowWidth
    if (this.pos.y > this.windowHeight) this.pos.y = 0
    if (this.pos.y < 0) this.pos.y = this.windowHeight
  }

  draw(ctx) {
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 1;
    ctx.save()
      ctx.translate(this.pos.x, this.pos.y)
      ctx.beginPath()
      ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2)
      ctx.closePath();
      ctx.stroke();
    ctx.restore()
  }





}
