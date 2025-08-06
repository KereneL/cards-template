import Phaser from 'phaser';
import { CARD_RECT_STYLE, CARD_TWEENS } from '../../config';
const { SHORT_DURATION, SHORTER_DURATION, DRAGGED_SCALE, DEFAULT_EASE, MAX_TILT, STANDARD_SCALE, HOVERED_SCALE } = CARD_TWEENS;
const SPRITESHEET_KEY = 'spritesheet-cards'

export class BaseCard extends Phaser.GameObjects.Container {
  constructor({ scene }) {
    super(scene, 0, 0);
    this.scene = scene;
    this.components = [];

    this.createCardShadow();
    this.createCardBody();

    this.once('addedtoscene', function () {
      for (const comp of this.components) {
        if (typeof comp.init === 'function') {
          comp.init();
        }
      }
    });
  }

  createCardBody() {
    const { CARD_BASE_WIDTH, CARD_BASE_HEIGHT, WIDTH_SCALE, HEIGHT_SCALE, CARD_STROKE_WIDTH } = CARD_RECT_STYLE
    const cardWidth = CARD_BASE_WIDTH * WIDTH_SCALE
    const cardHeight = CARD_BASE_HEIGHT * HEIGHT_SCALE
    const textureKey = 'card_blank_card';

    this.cardFace = new Phaser.GameObjects.Plane(this.scene, 0, 0, SPRITESHEET_KEY, 90, 1, 1)
      .setDisplaySize(cardWidth, cardHeight);

    this.cardBody = new Phaser.GameObjects.Container(this.scene, 0, 0, [this.cardFace])

    //this.circTween = applyCircularFloatTween(this.cardBody);

    this.width = cardWidth
    this.height = cardHeight
    this.scene.add.existing(this.cardBody)
    this.add(this.cardBody)
  }

  createCardShadow() {
    const { CARD_BASE_WIDTH, CARD_BASE_HEIGHT, WIDTH_SCALE, HEIGHT_SCALE } = CARD_RECT_STYLE
    const cardWidth = CARD_BASE_WIDTH * WIDTH_SCALE
    const cardHeight = CARD_BASE_HEIGHT * HEIGHT_SCALE

    this.cardShadow = new Phaser.GameObjects.Image(this.scene, -3 * WIDTH_SCALE, 3 * HEIGHT_SCALE, `texture_card_shadow`, 0)
      .setDisplaySize(cardWidth, cardHeight)
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(-1);

    this.add(this.cardShadow);
  }

  onPointerOver(pointer) {
    this.scene.tweens.add({
      targets: this,
      scale: HOVERED_SCALE,
      ease: DEFAULT_EASE,
      duration: SHORT_DURATION,
    })
  }
  onPointerMove(pointer) {
    const { x, y } = (this.getLocalPointerCoords(pointer, this.cardBody))
    const tiltX = y / (this.height / 2) * MAX_TILT
    const tiltY = x / (this.width / 2) * MAX_TILT
    this.scene.tweens.add({
      targets: this.cardBody.getAll(),
      rotateX: tiltX,
      rotateY: tiltY,
      duration: SHORTER_DURATION,
    });
  }

  onPointerOut(pointer) {
    this.scene.tweens.add({
      targets: this.cardBody.getAll(),
      rotateX: 0,
      rotateY: 0,
      duration: SHORT_DURATION,
    });
    this.scene.tweens.add({
      targets: this,
      scale: STANDARD_SCALE,
      duration: SHORT_DURATION,
    });


  }

  scaleForDrag() {
    this.scene.tweens.add({
      targets: this,
      scale: DRAGGED_SCALE,
      ease: DEFAULT_EASE,
      duration: SHORT_DURATION,
    });

    if (this.cardShadow) {
      this.scene.tweens.add({
        targets: this.cardShadow,
        alpha: 1,
        ease: DEFAULT_EASE,
        duration: SHORT_DURATION,
      });
    }
  }
  shakeForInvalidMove(onComplete = function () { }, onCompleteParams = []) {
    this.scene.tweens.add({
      targets: this,
      x: this.x + 10,
      duration: 50,
      ease: DEFAULT_EASE,
      yoyo: true,
      repeat: 2,
      completeDelay: SHORT_DURATION,
      onComplete,
      onCompleteParams,
    });
  }
  scaleAfterDrag() {
    this.scene.tweens.add({
      targets: this,
      scale: CARD_TWEENS.STANDARD_SCALE,
      ease: CARD_TWEENS.DEFAULT_EASE,
      duration: CARD_TWEENS.SHORT_DURATION,
    });
    if (this.cardShadow) {
      this.scene.tweens.add({
        targets: this.cardShadow,
        alpha: 0,
        ease: DEFAULT_EASE,
        duration: CARD_TWEENS.SHORT_DURATION,
      });
    }
  }

  getLocalPointerCoords(pointer, container) {
    const matrix = new Phaser.GameObjects.Components.TransformMatrix();
    container.getWorldTransformMatrix(matrix);
    matrix.invert();

    const localPoint = matrix.transformPoint(pointer.worldX, pointer.worldY);
    return new Phaser.Math.Vector2(localPoint.x, localPoint.y);
  }

  addComponent(ComponentClass, ...args) {
    const comp = new ComponentClass(this, ...args);
    this.components.push(comp);
  }
}

export function applyCircularFloatTween(gameObject, {
  radius = 1,
  duration = Phaser.Math.Between(2600, 3400),
  easing = 'Sine.easeInOut',
  delay = Phaser.Math.Between(0, 3000)
} = {}) {
  const scene = gameObject.scene;
  const startX = gameObject.x;
  const startY = gameObject.y;

  return scene.tweens.addMultiple([{
    targets: gameObject,
    x: { from: startX - radius, to: startX + radius },
    duration,
    ease: easing,
    yoyo: true,
    repeat: -1,
    delay: delay,
  }, {
    targets: gameObject,
    y: { from: startY - radius, to: startY + radius },
    duration,
    ease: easing,
    yoyo: true,
    repeat: -1,
    delay: delay + duration / 2
  }, {
    targets: gameObject,
    angle: { from: -radius, to: radius },
    duration,
    ease: easing,
    yoyo: true,
    repeat: -1,
    delay: delay
  }]);


}