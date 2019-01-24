import Vector from './lib/Vector'

export default class ShipFrontLight {
  constructor () {
    this.frontLightAngle = Math.PI / 5 // that is half the angle actually
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
      // create some rays, from ship to start of edge & ship to end of edge
      for (let i = 0; i < 2; i++) {
        // i==0 ==> ray towards start of edge
        // i==1 ==> ray towards end of edge
        const vX = edge[i].x - ship.pos.x
        const vY = edge[i].y - ship.pos.y
        const ray = new Vector(vX, vY)

        // we only add a ray if it's inside the lightbeam
        let a = ray.angle
        if (ship.angle < 0 && (a > Math.PI / 2)) {
          a -= 2 * Math.PI
        } else if (ship.angle > 0 && (a < -Math.PI / 2)) {
          a += 2 * Math.PI
        }
        if (a >= ship.angle - this.frontLightAngle && a <= ship.angle + this.frontLightAngle) {
          ray.setMag(this.rayLength)
          rays.push(ray)
          // create 2 other vectors just before & after this one
          const v1 = Vector.fromAngle(ray.angle - 0.0001, this.rayLength)
          const v2 = Vector.fromAngle(ray.angle + 0.0001, this.rayLength)
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
    _points.push(points[points.length - 1])

    points = _points

    // sorting points by their angle, careful, ship orientation matters
    points = points.sort(function (a, b) {
      let aAngle = a.angle
      let bAngle = b.angle

      if (ship.angle < -Math.PI / 2 || ship.angle > Math.PI / 2) {
        if (aAngle < 0) aAngle += 2 * Math.PI
        if (bAngle < 0) bAngle += 2 * Math.PI
      }

      if (aAngle < bAngle) return -1
      if (aAngle > bAngle) return 1

      return 0
    })

    return points
  }

  drawRays (ctx, ship) {
    const length = 1000
    ctx.lineWidth = 1

    this.rays.forEach((ray, index) => {
      ctx.beginPath()
      ctx.strokeStyle = '#F00'

      let a = ray.angle
      if (ship.angle < 0) {
        if (a > Math.PI / 2) a -= 2 * Math.PI
      }
      if (ship.angle > 0) {
        if (a < -Math.PI / 2) a += 2 * Math.PI
      }

      if (a >= ship.angle - this.frontLightAngle && a <= ship.angle + this.frontLightAngle) {
        ctx.strokeStyle = '#0F0'
      }

      ctx.moveTo(ship.pos.x, ship.pos.y)
      ctx.lineTo(ship.pos.x + ray.x, ship.pos.y + ray.y)
      ctx.stroke()

      const pos = ray.clone()
      pos.setMag(60)
      pos.add(ship.pos)

      ctx.fillStyle = '#FF0'
      ctx.beginPath()
      ctx.ellipse(pos.x, pos.y, 10, 10, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#00F'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(index, pos.x, pos.y)
    })

    this.points.forEach((p, index) => {
      const pos = p.clone()
      pos.setMag(pos.mag * 0.9)

      const x = (pos.x + ship.pos.x)
      const y = (pos.y + ship.pos.y)
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.ellipse(x, y, 6, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#FFF'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(index, x, y)
    })

    // dessiner les bords du beam
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(255, 255, 0, 1)'
    ctx.lineWidth = 2
    ctx.moveTo(ship.pos.x, ship.pos.y) // centre
    let x = ship.pos.x + Math.cos(ship.angle - this.frontLightAngle) * length
    let y = ship.pos.y + Math.sin(ship.angle - this.frontLightAngle) * length
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = 'rgba(255, 255, 0, 1)'
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
    // 3 - draw the polygon defined in this.points
    // 3.1 - make a gradient
    const x2 = ship.pos.x + Math.cos(ship.angle) * 600
    const y2 = ship.pos.y + Math.sin(ship.angle) * 600
    const gradient = ctx.createLinearGradient(ship.pos.x, ship.pos.y, x2, y2)
    // const gradient = ctx.createRadialGradient(ship.pos.x, ship.pos.y, 0.1, ship.pos.x, ship.pos.y, 400)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)')

    // 3.2 make the polygon & fill it
    if (this.points.length > 0) {
      ctx.beginPath()
      ctx.fillStyle = gradient
      ctx.moveTo(ship.pos.x, ship.pos.y) // centre
      this.points.forEach(p => {
        ctx.lineTo(ship.pos.x + p.x, ship.pos.y + p.y)
      })
      ctx.closePath()
      ctx.fill()
    }

    // this.drawRays(ctx, ship) // debug
  }
}
