import Phaser from 'phaser';
import { CARD_RECT_STYLE, CARD_TWEENS } from '../../config';
const { SHORT_DURATION, DRAGGED_SCALE, EASE } = CARD_TWEENS;
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
    const { CARD_BASE_SIZE, WIDTH_SCALE, HEIGHT_SCALE, CARD_STROKE_WIDTH } = CARD_RECT_STYLE
    const cardWidth = CARD_BASE_SIZE * WIDTH_SCALE
    const cardHeight = CARD_BASE_SIZE * HEIGHT_SCALE
    this.cardBody = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, cardWidth, cardHeight, 0xdddddd, 1)
      .setStrokeStyle(CARD_STROKE_WIDTH, 0x000000)

    this.add(this.cardBody)
  }
  createCardShadow() {
    const { CARD_BASE_SIZE } = CARD_RECT_STYLE;

    this.cardShadow = new Phaser.GameObjects.Rectangle(this.scene, 5, 5, CARD_BASE_SIZE * 2.5, CARD_BASE_SIZE * 3.5, 0x000000, 0.25)
      .setOrigin(0.5)
      .setScale(1)
      .setAlpha(0)
      .setDepth(-1);

    this.add(this.cardShadow);
  }
  scaleForDrag() {
    this.scene.tweens.add({
      targets: this,
      scale: DRAGGED_SCALE,
      ease: EASE,
      duration: SHORT_DURATION,
    });

    if (this.cardShadow) {
      this.scene.tweens.add({
        targets: this.cardShadow,
        alpha: 0.35,
        scale: DRAGGED_SCALE,
        ease: EASE,
        duration: SHORT_DURATION,
      });
    }
  }
  shakeForInvalidMove(onComplete = function () { }, onCompleteParams = []) {
    this.scene.tweens.add({
      targets: this,
      x: this.x + 10,
      duration: 50,
      ease: EASE,
      yoyo: true,
      repeat: 1,
      completeDelay: SHORT_DURATION,
      onComplete,
      onCompleteParams,
    });
  }
  scaleAfterDrag() {
    this.scene.tweens.add({
      targets: this,
      scale: CARD_TWEENS.IDLE_SCALE,
      ease: CARD_TWEENS.EASE,
      duration: CARD_TWEENS.SHORT_DURATION,
    });
    if (this.cardShadow) {
      this.scene.tweens.add({
        targets: this.cardShadow,
        alpha: 0,
        scale: 1,
        ease: EASE,
        duration: CARD_TWEENS.SHORT_DURATION,
      });
    }
  }
  addComponent(ComponentClass, ...args) {
    const comp = new ComponentClass(this, ...args);
    this.components.push(comp);
  }
}
