export default class canvasGameEngine {
  constructor (id, name, w, h) {
    this.name = name
    this.canvas = document.getElementById(id)

    this.canvas.width = w
    this.canvas.height = h

    this.w = w
    this.h = h

    this.ctx = canvas.getContext('2d')

    window.document.title = name
    this.setup()

    this.oldTime = 0
  }

  start () {
    requestAnimationFrame(this._loop.bind(this))
  }

  setup () {
  }

  _loop (time) {
    const elapsed = time - this.oldTime
    this.loop(elapsed)

    this.oldTime = time
    requestAnimationFrame(this._loop.bind(this))
  }

  loop (time) {
    // do nothing, will be overwritten
  }
}
