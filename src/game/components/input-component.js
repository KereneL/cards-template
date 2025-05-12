import { BaseComponent } from './base-component';

export class InputCardComponent extends BaseComponent {
  constructor(card, config = {
    hoverable: true,
    draggable: true,
  }) {
    super(card);

    this.hoverable = config.hoverable
    this.draggable = config.draggable
    this.isDragging = false;
    this.targetX = card.x;
    this.targetY = card.y;
    this.currentX = card.x;
    this.currentY = card.y;
    this.currentRotation = 0;
    this.rotationTarget = 0;
    this.velocityX = 0;
    this.lastPointerX = null;

    card.setInteractive({
      draggable: this.draggable,
      hitArea: new Phaser.Geom.Rectangle(
        -card.cardBody.width / 2,
        -card.cardBody.height / 2,
        card.cardBody.width,
        card.cardBody.height
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
}
}