export default class Keys {
  constructor () {
    this.keyDownActions = {}
    this.keyUpActions = {}
    this.addKeysListeners()
  }

  addKeysListeners () {
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  addKeyDownAction (keyCode, fn) {
    this.keyDownActions[keyCode] = fn
  }

  addKeyUpAction (keyCode, fn) {
    this.keyUpActions[keyCode] = fn
  }

  onKeyDown (e) {
    if (this.keyDownActions[e.keyCode] !== undefined) {
      this.keyDownActions[e.keyCode]()
    }
  }

  onKeyUp (e) {
    if (this.keyUpActions[e.keyCode] !== undefined) {
      this.keyUpActions[e.keyCode]()
    }
  }
}
