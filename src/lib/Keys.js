export default class Keys {
  constructor (canvasElement, debug) {
    this.debug = debug
    this.keyDownActions = {}
    this.keyUpActions = {}
    this.addKeysListeners()

    this.mouseDownAction = null
    this.mouseUpAction = null
    this.addMouseListeners(canvasElement)
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

  addKeysAction (keyCode, downFn, upFn) {
    this.addKeyDownAction(keyCode, downFn)
    this.addKeyUpAction(keyCode, upFn)
  }

  onKeyDown (e) {
    if (this.debug) console.log('KEYDOWN', e.keyCode)
    if (this.keyDownActions[e.keyCode] !== undefined) {
      this.keyDownActions[e.keyCode]()
    }
  }

  onKeyUp (e) {
    if (this.keyUpActions[e.keyCode] !== undefined) {
      this.keyUpActions[e.keyCode]()
    }
  }

  addMouseListeners (canvasElement) {
    canvasElement.addEventListener('mousedown', this.onMouseDown.bind(this))
    // canvasElement.addEventListener('mouseup', this.onMouseUp.bind(this))
  }

  addMouseDownAction (fn) {
    this.mouseDownAction = fn
  }

  onMouseDown (e) {
    if (this.mouseDownAction) {
      this.mouseDownAction(e)
    }
  }
}
