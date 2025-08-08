export class BaseComponent {
  constructor(gameObject) {
    this.gameObject = gameObject;
    this.scene = gameObject.scene;
    this.attach();
  }

  attach() {
    this.gameObject[`_${this.constructor.name}`] = this;
  }

  static getComp(gameObject) {
    if (!gameObject) return null;
    return gameObject[`_${this.name}`] || null;
  }
  
  static removeComp(gameObject) {
    if (!gameObject) return;
    delete gameObject[`_${this.name}`];
  }

  init() {}
  destroy() {}
}