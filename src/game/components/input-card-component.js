import { CARD_RECT_STYLE } from '../config';
import { InputComponent } from './input-component';

export class InputCardComponent extends InputComponent {
  constructor(card, config = {
    hoverable: true,
    draggable: true,
    clickable: true,
  }) {
    super(card, config);
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