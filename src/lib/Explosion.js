// starts a particle system in the shape of an explosion
import Particle from './Particle'

export default class Explosion {
  constructor (x, y) {
    this.particles = []
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 3
      const damping = 0.95
      this.particles[i] = new Particle(x, y, angle, speed, damping)
    }
  }

  draw (ctx) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      p.update()
      p.draw(ctx)
    }
  }
}
