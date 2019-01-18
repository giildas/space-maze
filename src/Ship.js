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

  resetPos () {
    // if (!this.explosion) return // no reset of the ship while it's not exploding

    this.explosion = null
    this.pos = new Vector(this.initialPos.x, this.initialPos.y)
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
    this.angle = newAngle % (Math.PI * 2)

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
    edges.forEach(edge => {
      for (let i = 0; i < 2; i++) {
        // créer les vecteur ray, du ship vers les extrémités de l'edge
        // si i==0 ==> vers le début
        // si i==1 ==> vers la fin de l'edge

        const vX = edge[i].x - this.pos.x
        const vY = edge[i].y - this.pos.y
        const v = new Vector(vX, vY)

        // BUG a cause du modulo de : 0 < this.angle < 2PI
        // TODO gérer ça
        const vAngle = v.angle
        if (
          vAngle > this.angle - this.frontLightAngle &&
          vAngle < this.angle + this.frontLightAngle) {
          this.rays.push(v)
        }
      }
    })
  }

  calculateRaysIntersection (maze) {
    this._points = []

    this.rays.forEach(ray => {
      let minT1 = Infinity
      let minPx = 0
      let minPy = 0
      let bValid = false
      let minAng = 0
      maze.edges.forEach(e => {
        // rdx ====> ray.x
        // rdy ====> ray.y

        // float sdx = e2.ex - e2.sx; ====> edgeVec.x
        // float sdy = e2.ey - e2.sy; ====> edgeVec.y
        const edgeVec = new Vector(e[1].x - e[0].x, e[1].y - e[0].y)

        // si pas alignés
        // if (fabs(sdx - rdx) > 0.0f && fabs(sdy - rdy) > 0.0f)
        if (Math.abs(edgeVec.x - ray.x) > 0 && Math.abs(edgeVec.y - ray.y) > 0) {
          // t2 is normalised distance from line segment start to line segment end of intersect point
          // float t2 = (rdx * (e2.sy - oy) + (rdy * (ox - e2.sx))) / (sdx * rdy - sdy * rdx);
          const t2 = (ray.x * (e[0].y - this.pos.y) + (ray.y * (this.pos.x - e[0].x))) / (edgeVec.x * ray.y - edgeVec.y * ray.x)
          // t1 is normalised distance from source along ray to ray length of intersect point
          // float t1 = (e2.sx + sdx * t2 - ox) / rdx;
          const t1 = (e[0].x + edgeVec.x * t2 - this.pos.x) / ray.x

          // if (t1 > 0 && t2 >= 0 && t2 <= 1.0f)
          // If intersect point exists along ray, and along line segment then intersect point is valid
          if (t1 > 0 && t2 >= 0 && t2 <= 1) {
          // Check if this intersect point is closest to source. If
          // it is, then store this point and reject others
            if (t1 < minT1) {
              minT1 = t1
              minPx = this.pos.x + ray.x * t1
              minPy = this.pos.y + ray.y * t1
              minAng = Math.atan2(minPy - this.pos.y, minPx - this.pos.x)
              bValid = true
            }
          }
        }
      })
      if (bValid) this._points.push([minAng, minPx, minPy])
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

    this._points.forEach(p => {
      ctx.fillStyle = '#FF0'
      ctx.beginPath()
      ctx.ellipse(p[1], p[2], 5, 5, 0, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  drawFrontLight (ctx, maze) {
    if (this.explosion) return
    const length = 600
    // make a gradient
    const x2 = this.pos.x + Math.cos(this.angle) * 600
    const y2 = this.pos.y + Math.sin(this.angle) * 600
    const gradient = ctx.createLinearGradient(this.pos.x, this.pos.y, x2, y2)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)')

    // 1 - envoyer X rays dans toute la surface de la lumière avant
    this.makeRays(length, maze)
    this.calculateRaysIntersection(maze)
    this.drawRays(ctx)
    // 2 - si un ray insersecte avec un mur, mettre un point

    ctx.beginPath()
    let x = this.pos.x + Math.cos(this.angle - this.frontLightAngle) * length
    let y = this.pos.y + Math.sin(this.angle - this.frontLightAngle) * length
    ctx.lineTo(x, y)

    x = this.pos.x + Math.cos(this.angle + this.frontLightAngle) * length
    y = this.pos.y + Math.sin(this.angle + this.frontLightAngle) * length
    ctx.lineTo(x, y)

    ctx.lineTo(this.pos.x, this.pos.y)

    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // ctx.fillStyle = '#FF0'
    // ctx.fillRect(this.pos.x, this.pos.y, 5, 5)
    // ctx.fillRect(x2, y2, 5, 5)
  }
}
