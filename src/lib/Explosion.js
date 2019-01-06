// starts a particle system in the shape of an explosion
import Particle from './Particle'

export default class Explosion {
  constructor (x, y, angle, speed, size) {
    this.particles = []
    for (let i = 0; i < 10; i++) {
      const a = angle + ((Math.random() - 0.5) * Math.PI / 2)
      const s = speed + (Math.random() - 1)
      const damping = 0.95
      const color = i === 0 ? '#0FF' : '#999'
      this.particles[i] = new Particle(x, y, a, s, damping, size / 2, color)
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
