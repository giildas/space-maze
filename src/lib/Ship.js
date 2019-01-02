import Vector from './Vector'

export default class Ship {

  constructor (width, height) {
    this.windowWidth = width
    this.windowHeight = height

    this.pos = new Vector(width/2, height/2)
    this.vel = new Vector(0, 0)
    this.angle = Math.PI
    this.shipAngleOffset = 0

    this.w = 30
    this.h = 15

    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  update () {
    let newPos = this.pos.add(this.vel)
    this.pos = newPos
    if (this.pos.x > this.windowWidth) this.pos.x = 0
    if (this.pos.x < 0) this.pos.x = this.windowWidth
    if (this.pos.y > this.windowHeight) this.pos.y = 0
    if (this.pos.y < 0) this.pos.y = this.windowHeight


    let newAngle = this.angle + this.shipAngleOffset
    this.angle = newAngle
  }

  onKeyDown(e) {
    // left
    if (e.keyCode === 37) this.shipAngleOffset = -0.1
    // right
    if (e.keyCode === 39) this.shipAngleOffset = 0.1
    // up
    if (e.keyCode === 38) {
      let force = Vector.fromAngle(this.angle)
      let newVel = this.vel.add(force)
      this.vel =  newVel
    }
  }

  onKeyUp(e) {
    this.shipAngleOffset = 0
  }
}
