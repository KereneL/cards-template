import { CARD_RECT_STYLE } from '../config';
import { BaseComponent } from './base-component';

export class InputCardComponent extends BaseComponent {
  constructor(card, config = {
    hoverable: true,
    draggable: true,
  }) {
    super(card);

    this.hoverable = config.hoverable
    this.draggable = config.draggable
    this.shouldUpdate = true;
    this.physicsEnabled = true;
    this.isDragging = false;

    this.targetX = card.x;
    this.targetY = card.y;
    this.currentX = card.x;
    this.currentY = card.y;
    this.originalZone = null;
    this.currentRotation = 0;
    this.rotationTarget = 0;
    this.velocityX = 0;
    this.lastPointerX = null;

    const { CARD_BASE_WIDTH, CARD_BASE_HEIGHT, WIDTH_SCALE, HEIGHT_SCALE } = CARD_RECT_STYLE
    const cardWidth = CARD_BASE_WIDTH * WIDTH_SCALE
    const cardHeight = CARD_BASE_HEIGHT * HEIGHT_SCALE

    card.setInteractive({
      draggable: this.draggable,
      hitArea: new Phaser.Geom.Rectangle(
        0,
        0,
        cardWidth,
        cardHeight
      ),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains
    });

    card.on('positionChanged', function () {
      this.refreshPosition();
    }, this);
  }

  refreshPosition() {
    this.currentX = this.gameObject.x;
    this.currentY = this.gameObject.y;
    this.physicsEnabled = true;
  }
}