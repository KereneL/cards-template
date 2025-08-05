import { CARD_RECT_STYLE } from '../config';
import { BaseComponent } from './base-component';

export class InputComponent extends BaseComponent {
  static KEY = '_InputComponent';

  static getComp(gameObject) {
    return gameObject[InputComponent.KEY] || null;
  }

  static removeComp(gameObject) {
    if (gameObject[InputComponent.KEY]) {
      delete gameObject[InputComponent.KEY];
    }
  }

  attach() {
    this.gameObject[InputComponent.KEY] = this;
  }

  constructor(gameObject, config = {
    hoverable: true,
    draggable: true,
    clickable: true,
  }) {
    super(gameObject);
    this.hoverable = config.hoverable
    this.draggable = config.draggable
    this.clickable = config.clickable

    this.shouldUpdate = true;
    this.physicsEnabled = false;
    this.isDragging = false;

    gameObject.setInteractive({
      draggable: this.draggable,
      hitArea: new Phaser.Geom.Rectangle(
        0,
        0,
        gameObject.displayWidth,
        gameObject.displayHeight
      ),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains
    });
  }
}