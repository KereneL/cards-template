import Phaser from 'phaser';
import { BaseComponent } from './base-component';
export class InputComponent extends BaseComponent {
  constructor(gameObject, config = { isHoverable: true, isDraggable: true, isClickable: true, isDropZone: false }) {
    super(gameObject);
    this.isHoverable = config.isHoverable
    this.isDraggable = config.isDraggable
    this.isClickable = config.isClickable
    this.isDropZone = config.isDropZone

    if (this.isDraggable && this.isDropZone) console.warn("Object is both isHoverable and isDraggable!:", gameObject)


    this.shouldUpdate = true;
    this.physicsEnabled = false;
    this.enabled = true;

    this.setInteractiveZone()
    if (this.isDraggable) this.setDraggable()
  }
  setInteractiveZone() {
    const gameObject = this.gameObject;
    gameObject.setInteractive({
      draggable: this.isDraggable,
      dropZone: this.isDropZone,
      hitArea: new Phaser.Geom.Rectangle(
        0, 0,
        gameObject.displayWidth, gameObject.displayHeight),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains
    });

  }
  setDraggable() {
    const gameObject = this.gameObject;
    this.isBeingDragged = false;
    this.targetX = gameObject.x;
    this.targetY = gameObject.y;
    this.currentX = gameObject.x;
    this.currentY = gameObject.y;
    this.originalZone = null;
    this.lastPointerX = null;
    this.currentRotation = 0;
    this.rotationTarget = 0;
    this.velocityX = 0;

    this.refreshPosition = () => {
      this.currentX = this.gameObject.x;
      this.currentY = this.gameObject.y;
      this.physicsEnabled = true;
    }
    gameObject.on('positionChanged', this.refreshPosition, this.scene);
  }

}