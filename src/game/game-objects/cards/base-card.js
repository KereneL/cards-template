import Phaser from 'phaser';
import { CARD_RECT_STYLE, CARD_TWEENS } from '../../config';
const { SHORT_DURATION, DRAGGED_SCALE, DEFAULT_EASE } = CARD_TWEENS;
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
    const textureKey = 'blank_card';
    
    this.cardBody = new Phaser.GameObjects.Plane(this.scene, 0, 0, textureKey, 0, 1, 1)
    .setDisplaySize(cardWidth, cardHeight);
    this.width = cardWidth
    this.height = cardHeight
    this.scene.add.existing(this.cardBody)
    this.add(this.cardBody)
  }

  createCardShadow() {
    const { CARD_BASE_WIDTH, CARD_BASE_HEIGHT, WIDTH_SCALE, HEIGHT_SCALE } = CARD_RECT_STYLE
    const cardWidth = CARD_BASE_WIDTH * WIDTH_SCALE
    const cardHeight = CARD_BASE_HEIGHT * HEIGHT_SCALE

    this.cardShadow = new Phaser.GameObjects.Image(this.scene, -3*WIDTH_SCALE, 3*HEIGHT_SCALE, `card_shadow`,0)
      .setDisplaySize(cardWidth, cardHeight)
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(-1);

    this.add(this.cardShadow);
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
      repeat: 1,
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
  addComponent(ComponentClass, ...args) {
    const comp = new ComponentClass(this, ...args);
    this.components.push(comp);
  }
}
