import Vector from './lib/Vector'
import Explosion from './Explosion'

export default class Ship {
  constructor (x, y, radius) {
    this.r = radius

    this.initialPos = new Vector(x, y)
    this.acceleration = new Vector(0, 0)
    this.pos = new Vector(x, y)
    this.vel = new Vector(0, 0)

    this.angle = 0
    this.shipAngleOffset = 0

    this.boost = 0

    this.explosion = null

    this.frontLightAngle = Math.PI / 6 // that is half the angle actually

    this.rays = []
    this._points = []
  }

  startTurning (offset) { this.shipAngleOffset = offset }
  stopTurning () { this.shipAngleOffset = 0 }
  startBoost (boostPower) { this.boost = boostPower }
  stopBoost () { this.boost = 0 }

  resetPos (x = this.initialPos.x, y = this.initialPos.y) {
    // if (!this.explosion) return // no reset of the ship while it's not exploding

    this.explosion = null
    this.pos = new Vector(x, y)
    this.vel = new Vector(0, 0)
    this.angle = 0
    this.shipAngleOffset = 0

    this.boost = 0
    this.enteringPortal = false

    this.acceleration = new Vector(0, 0)
  }

  update (deltaTime) {
    if (this.explosion) return

    // update operation
    // this.pos = position du vaisseau
    // acceleration : ajouté à la vélocité, doit etre proportionnel à deltatime
    // this.vel: vitesse
    //    * ajouté à chaque frame (si framerate 60, doit etre 3x inf à framerate 20 ...)
    //    * constraint à une vitesse max, si framerate
    //
    const newAngle = this.angle + this.shipAngleOffset * 0.001 * deltaTime
    this.angle = newAngle
    // angle constrained between -PI and +PI
    if (this.angle < -Math.PI) this.angle += Math.PI * 2
    if (this.angle > Math.PI) this.angle -= Math.PI * 2

    if (this.boost > 0 && !this.enteringPortal) {
      this.acceleration = Vector.fromAngle(this.angle, this.boost * 0.001 * deltaTime)
    } else {
      this.acceleration = new Vector(0, 0)
    }
    this.vel.add(this.acceleration)
    this.vel.constrain(0.25 * deltaTime)
    this.pos.add(this.vel)

    if (this.enteringPortal) {
      this.r -= 0.1
      this.r = Math.max(this.r, 0.1)
    }
  }

  edges (w, h) {
    if (this.pos.x > w + this.r) this.pos.x = 0
    if (this.pos.y > h + this.r) this.pos.y = 0
    if (this.pos.x < -this.r) this.pos.x = w + this.r
    if (this.pos.y < -this.r + this.r) this.pos.y = h + this.r
  }

  explode (cb) {
    if (!this.explosion) {
      const movmentDir = this.vel.angle

      const speed = this.vel.mag
      this.explosion = new Explosion(this.pos.x, this.pos.y, movmentDir, speed, this.r, cb)
    }
  }

  enterPortal (portal, cb) {
    if (this.enteringPortal) return

    this.enteringPortal = true
    this.portalCb = cb
    this.portalPos = portal.pos

    const p = this.pos.clone()
    p.subtract(portal.pos)
    p.mult(-1)
    p.setMag(1)
    this.vel = p

    setTimeout(cb, 500)
  }

  draw (ctx) {
    if (this.explosion) {
      this.explosion.draw(ctx)
    } else {
      this._drawShip(ctx)
      this._drawBoost(ctx)
    }
  }

  _drawShip (ctx) {
    ctx.save()
    ctx.fillStyle = '#999'
    ctx.translate(this.pos.x, this.pos.y)
    ctx.rotate(this.angle)
    ctx.beginPath()
    ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()

    ctx.beginPath()
    ctx.strokeStyle = '#0FF'
    ctx.lineWidth = this.r / 4
    const r = this.r * 0.5
    ctx.ellipse(0, 0, r, r, 0, -Math.PI / 4, Math.PI / 4)

    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }

  _drawBoost (ctx) { //, x, y, scale, color) {
    if (this.boost === 0) return
    const scale = 2
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.rotate(this.angle)
    ctx.fillStyle = '#ff860d'
    ctx.beginPath()
    ctx.moveTo(-this.r, -this.r / 4 * scale)
    ctx.lineTo(-this.r - this.r / 1.5 * scale, 0)
    ctx.lineTo(-this.r, this.r / 4 * scale)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  makeRays (length, maze) {
    const { edges } = maze

    this.rays = []

    // adding a ray for left and right of light beam
    const vStart = Vector.fromAngle(this.angle - this.frontLightAngle, length)
    const vEnd = Vector.fromAngle(this.angle + this.frontLightAngle, length)
    this.rays.push(vStart)
    this.rays.push(vEnd)

    edges.forEach(edge => {
      for (let i = 0; i < 2; i++) {
        // créer les vecteur ray, du ship vers les extrémités de l'edge
        // si i==0 ==> vers le début
        // si i==1 ==> vers la fin de l'edge
        const vX = edge[i].x - this.pos.x
        const vY = edge[i].y - this.pos.y
        const v = new Vector(vX, vY)
        v.setMag(length)

        const vAngle = v.angle
        if (vAngle >= this.angle - this.frontLightAngle && vAngle <= this.angle + this.frontLightAngle) {
          this.rays.push(v)
          // creer 2 autres vecteurs juste avant et juste apres l'angle
          const v1 = Vector.fromAngle(vAngle - 0.001, length)
          const v2 = Vector.fromAngle(vAngle + 0.001, length)
          this.rays.push(v1)
          this.rays.push(v2)
        }
      }
    })
  }

  calculateRaysIntersection (maze) {
    this._points = []

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
          const t2 = (ray.x * (e[0].y - this.pos.y) + (ray.y * (this.pos.x - e[0].x))) / (eX * ray.y - eY * ray.x)
          // t1 is normalised distance from ship to line intersection point
          const t1 = (e[0].x + eX * t2 - this.pos.x) / ray.x
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
      if (minV) this._points.push(minV)
    })

    // filtrer le polygone pour enlever les points similaires
    const points = []
    const limit = 3
    for (let i = 0; i < this._points.length - 1; i++) {
      // return fabs(get<1>(t1) - get<1>(t2)) < 0.1f && fabs(get<2>(t1) - get<2>(t2)) < 0.1f;
      const p1 = this._points[i]
      const p2 = this._points[i + 1]
      const similar = Math.abs(p1.x - p2.x) < limit && Math.abs(p1.y - p2.y) < limit
      if (!similar) {
        points.push(p1)
      }
    }
    points.push(this._points[this._points.length - 1])

    this._points = points

    // on trie les points par leur angle
    this._points.sort((a, b) => {
      const aAngle = a.angle // < 0 ? a.angle + Math.PI : a.angle
      const bAngle = b.angle // < 0 ? b.angle + Math.PI : b.angle
      if (aAngle < bAngle) return -1
      if (aAngle > bAngle) return 1
      return 0
    })
  }

  drawRays (ctx) {
    ctx.lineWidth = 1

    this.rays.forEach(ray => {
      ctx.beginPath()
      ctx.strokeStyle = '#F00'
      ctx.moveTo(this.pos.x, this.pos.y)
      ctx.lineTo(this.pos.x + ray.x, this.pos.y + ray.y)
      ctx.stroke()
    })

    this._points.forEach((p, index) => {
      const x = (p.x + this.pos.x) * 0.9
      const y = (p.y + this.pos.y) * 0.9
      ctx.fillStyle = '#FF0'
      ctx.beginPath()
      ctx.ellipse(x, y, 10, 10, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#00F'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(index, x, y)
    })
  }

  drawFrontLight (ctx, maze) {
    if (this.explosion) return
    const length = 1000
    // make a gradient
    const x2 = this.pos.x + Math.cos(this.angle) * 600
    const y2 = this.pos.y + Math.sin(this.angle) * 600
    const gradient = ctx.createLinearGradient(this.pos.x, this.pos.y, x2, y2)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)')

    // 1 - envoyer X rays dans toute la surface de la lumière avant
    this.makeRays(length, maze)
    // 2 - si un ray insersecte avec un mur, mettre un point
    this.calculateRaysIntersection(maze)
    // 2.1 - dessiner les rays (debug)
    this.drawRays(ctx)

    // 3 - dessiner le polygone ainsi formé dans this._points
    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.fillStyle = gradient
    ctx.moveTo(this.pos.x, this.pos.y) // centre
    this._points.forEach(p => {
      ctx.lineTo(this.pos.x + p.x, this.pos.y + p.y)
    })
    ctx.closePath()
    ctx.fill()

    // Avec des triangles
    // ctx.fillStyle = '#FFF'
    // for (let i = 0; i < this._points.length - 1; i++) {
    //   const p1 = this._points[i]
    //   const p2 = this._points[i + 1]
    //   ctx.beginPath()
    //   ctx.moveTo(this.pos.x, this.pos.y) // centre
    //   ctx.lineTo(this.pos.x + p1.x, this.pos.y + p1.y)
    //   ctx.lineTo(this.pos.x + p2.x, this.pos.y + p2.y)
    //   ctx.closePath()
    //   ctx.fill()
    // }

    // dessiner les bords du beam
    ctx.beginPath()
    ctx.strokeStyle = '#FF0'
    ctx.lineWidth = 2
    ctx.moveTo(this.pos.x, this.pos.y) // centre
    let x = this.pos.x + Math.cos(this.angle - this.frontLightAngle) * length
    let y = this.pos.y + Math.sin(this.angle - this.frontLightAngle) * length
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = '#FF0'
    ctx.lineWidth = 2
    ctx.moveTo(this.pos.x, this.pos.y) // centre
    x = this.pos.x + Math.cos(this.angle + this.frontLightAngle) * length
    y = this.pos.y + Math.sin(this.angle + this.frontLightAngle) * length
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.stroke()
  }
}
