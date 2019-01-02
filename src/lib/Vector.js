export default class Vector {

  constructor (x, y) {
    this.x = x
    this.y = y
  }

  static fromAngle (angle, length = 1) {
    return new Vector(length * Math.cos(angle), length * Math.sin(angle))
  }

  add(other) {
    let x = this.x + other.x
    let y = this.y + other.y

    return new Vector(x, y)
  }

  subtract (other) {
    let x = this.x - other.x
    let y = this.y - other.y
    return new Vector(x, y)
  }

  mult(a) {
    return new Vector (this.x * a, this.y * a)
  }
  mag () {
    return  Math.sqrt( this.x * this.x + this.y + this.y )
  }

}
