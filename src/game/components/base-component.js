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
    return gameObject[`_${this.name}`] || null;
  }

  static removeComp(gameObject) {
    delete gameObject[`_${this.name}`];
  }

  init() {}
  destroy() {}
}
