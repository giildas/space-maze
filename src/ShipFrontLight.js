import Vector from './lib/Vector'

export default class ShipFrontLight {
  constructor () {
    this.frontLightAngle = Math.PI / 6 // that is half the angle actually
    this.rays = []
    this.points = []
    this.rayLength = 1000
  }

  makeRays (ship, maze) {
    // empty this.rays
    const rays = []

    // adding a ray for left and right of light beam
    const vStart = Vector.fromAngle(ship.angle - this.frontLightAngle, this.rayLength)
    const vEnd = Vector.fromAngle(ship.angle + this.frontLightAngle, this.rayLength)
    rays.push(vStart)
    rays.push(vEnd)

    maze.edges.forEach(edge => {
      for (let i = 0; i < 2; i++) {
      // créer les vecteur ray, du ship vers les extrémités de l'edge
      // si i==0 ==> vers le début
      // si i==1 ==> vers la fin de l'edge
        const vX = edge[i].x - ship.pos.x
        const vY = edge[i].y - ship.pos.y
        const v = new Vector(vX, vY)
        v.setMag(this.rayLength)

        const vAngle = v.angle
        if (vAngle >= ship.angle - this.frontLightAngle && vAngle <= ship.angle + this.frontLightAngle) {
          rays.push(v)
          // creer 2 autres vecteurs juste avant et juste apres l'angle
          const v1 = Vector.fromAngle(vAngle - 0.001, this.rayLength)
          const v2 = Vector.fromAngle(vAngle + 0.001, this.rayLength)
          rays.push(v1)
          rays.push(v2)
        }
      }
    })

    return rays
  }

  calculateRaysIntersection (ship, maze) {
    let points = []

    this.rays.forEach(ray => {
      let minT1 = Infinity
      let minV = null

      maze.edges.forEach(e => {
      // edge coordinates
        const eX = e[1].x - e[0].x
        const eY = e[1].y - e[0].y
        // test if ray and edges are not aligned
        if (Math.abs(eX - ray.x) > 0 && Math.abs(eY - ray.y) > 0) {
        // t2 is normalized distance from edge start to intersection point
          const t2 = (ray.x * (e[0].y - ship.pos.y) + (ray.y * (ship.pos.x - e[0].x))) / (eX * ray.y - eY * ray.x)
          // t1 is normalised distance from ship to line intersection point
          const t1 = (e[0].x + eX * t2 - ship.pos.x) / ray.x
          // if intersect point exists along ray, and along line segment then intersect point is valid
          if (t1 > 0 && t2 >= 0 && t2 <= 1) {
          // keep only the closest intersection from the ship
            if (t1 < minT1) {
              minT1 = t1
              minV = new Vector(ray.x * t1, ray.y * t1)
            }
          }
        }
      })
      if (minV) points.push(minV)
    })

    // filter the intersection points to remove similar points
    const _points = []
    const limit = 3 // points get removed if 3px close
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i]
      const p2 = points[i + 1]
      const similar = Math.abs(p1.x - p2.x) < limit && Math.abs(p1.y - p2.y) < limit
      if (!similar) {
        _points.push(p1)
      }
    }
    // don't forget last point
    _points.push(points.pop())

    points = _points

    // on trie les points par leur angle
    points.sort((a, b) => {
      const aAngle = a.angle // < 0 ? a.angle + Math.PI : a.angle
      const bAngle = b.angle // < 0 ? b.angle + Math.PI : b.angle
      if (aAngle < bAngle) return -1
      if (aAngle > bAngle) return 1
      return 0
    })

    return points
  }

  drawRays (ctx, ship) {
    const length = 1000
    ctx.lineWidth = 1

    this.rays.forEach(ray => {
      ctx.beginPath()
      ctx.strokeStyle = '#F00'
      ctx.moveTo(ship.pos.x, ship.pos.y)
      ctx.lineTo(ship.pos.x + ray.x, ship.pos.y + ray.y)
      ctx.stroke()
    })

    this.points.forEach((p, index) => {
      const x = (p.x + ship.pos.x) * 0.9
      const y = (p.y + ship.pos.y) * 0.9
      ctx.fillStyle = '#FF0'
      ctx.beginPath()
      ctx.ellipse(x, y, 10, 10, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#00F'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(index, x, y)
    })

    // dessiner les bords du beam
    ctx.beginPath()
    ctx.strokeStyle = '#FF0'
    ctx.lineWidth = 2
    ctx.moveTo(ship.pos.x, ship.pos.y) // centre
    let x = ship.pos.x + Math.cos(ship.angle - this.frontLightAngle) * length
    let y = ship.pos.y + Math.sin(ship.angle - this.frontLightAngle) * length
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = '#FF0'
    ctx.lineWidth = 2
    ctx.moveTo(ship.pos.x, ship.pos.y) // centre
    x = ship.pos.x + Math.cos(ship.angle + this.frontLightAngle) * length
    y = ship.pos.y + Math.sin(ship.angle + this.frontLightAngle) * length
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.stroke()
  }

  update (ship, maze) {
    // 1 - send rays inside the front lightbeam
    this.rays = this.makeRays(ship, maze)
    // 2 - cut rays if they intersect with a wall
    this.points = this.calculateRaysIntersection(ship, maze)
  }

  draw (ctx, ship) {
    // this.drawRays(ctx, ship) // debug

    // 3 - draw the polygon defined in this.points
    // 3.1 - make a gradient
    const x2 = ship.pos.x + Math.cos(ship.angle) * 600
    const y2 = ship.pos.y + Math.sin(ship.angle) * 600
    const gradient = ctx.createLinearGradient(ship.pos.x, ship.pos.y, x2, y2)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)')

    // 3.2 make the polygon & fill it
    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.fillStyle = gradient
    ctx.moveTo(ship.pos.x, ship.pos.y) // centre
    this.points.forEach(p => {
      ctx.lineTo(ship.pos.x + p.x, ship.pos.y + p.y)
    })
    ctx.closePath()
    ctx.fill()

  // Avec des triangles
  // ctx.fillStyle = '#FFF'
  // for (let i = 0; i < this.points.length - 1; i++) {
  //   const p1 = this.points[i]
  //   const p2 = this.points[i + 1]
  //   ctx.beginPath()
  //   ctx.moveTo(this.pos.x, this.pos.y) // centre
  //   ctx.lineTo(this.pos.x + p1.x, this.pos.y + p1.y)
  //   ctx.lineTo(this.pos.x + p2.x, this.pos.y + p2.y)
  //   ctx.closePath()
  //   ctx.fill()
  // }
  }
}
