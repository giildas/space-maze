export default class Vector {
  constructor (x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  static fromAngle (angle, length = 1) {
    return new Vector(length * Math.cos(angle), length * Math.sin(angle))
  }

  clone () {
    return new Vector(this.x, this.y)
  }

  get mag () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  get angle () {
    // between -PI & +PI
    return Math.atan2(this.y, this.x)
  }

  distance (other) {
    return Math.hypot(other.x - this.x, other.y - this.y)
  }

  add (other) {
    this.x = this.x + other.x
    this.y = this.y + other.y
  }
  subtract (other) {
    this.x = this.x - other.x
    this.y = this.y - other.y
  }
  mult (a) {
    this.x = this.x * a
    this.y = this.y * a
  }
  setMag (mag) {
    const currentMag = this.mag
    this.x = this.x * mag / currentMag
    this.y = this.y * mag / currentMag
  }

  constrain (mag) {
    if (this.mag > mag) {
      this.setMag(mag)
    }
  }
}
