export default class Vector {

  constructor (x, y) {
    this.x = x
    this.y = y
  }

  static fromAngle (angle, length = 1) {
    return new Vector(length * Math.cos(angle), length * Math.sin(angle))
  }

  distance(other) {
    return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2)  )
  }

  get mag () {
    return  Math.sqrt( this.x * this.x + this.y * this.y )
  }
  add(other) {
    this.x = this.x + other.x
    this.y = this.y + other.y
  }
  subtract (other) {
    this.x = this.x - other.x
    this.y = this.y - other.y
  }
  mult(a) {
    this.x = this.x * a
    this.y = this.y * a
  }
  setMag(mag) {
    let currentMag = this.mag
    this.x = this.x * mag / currentMag
    this.y = this.y * mag / currentMag
  }
}
