import Phaser from 'phaser';
import { worldToLocal } from '../../utils';
import { InputCardComponent } from '../../components/input-component';
import { BaseCard } from '../cards/base-card';
import { CARD_RECT_STYLE, CARD_TWEENS } from '../../config';

export class BaseZone extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, config = {}) {
    super(scene, x, y);

    this.scene = scene;
    this.width = width;
    this.height = height;
    this.cards = [];

    this.playerSortable = config.playerSortable ?? false;
    this.defaultCueMode = config.defaultCueMode ?? 'push'; // or 'shift'
    this._cueIndex = null;

    this.setSize(width, height);
    scene.add.existing(this);

    this.background = scene.add.rectangle(0, 0, width, height, 0x000000, 0.1).setOrigin(0.5);
    this.add(this.background);

    this.createCueCard();
    this.setupInteractiveZone();
  }

  setupInteractiveZone() {
    this.phaserZone = this.scene.add.zone(0, 0, this.width, this.height)
      .setOrigin(0.5)
      .setInteractive({ dropZone: true });

    this.add(this.phaserZone);
    this.phaserZone.parentContainer = this;
  }
  handleDragStart(gameObject) {
    const comp = InputCardComponent.getComp(gameObject);
    if (!comp || !this.cards.includes(gameObject)) return;

    const index = this.cards.indexOf(gameObject);

      gameObject.setDepth(9999); // Arbitrary high number
  this.sortChildren();
  
    this._originCard = gameObject;
    this._cueIndex = index;
    this._cueIsInsert = false;
    this.cueCard.setPosition(gameObject.x, gameObject.y);
    this.cueCard.setDepth(gameObject.depth);
    this.cueCard.visible = true;

    this.showCueCard();
  }
  handleDragEnter(gameObject) {
    const comp = InputCardComponent.getComp(gameObject);
    const fromZone = comp?.originalZone;

    const index = this.getDropCueIndex(gameObject, fromZone);

    if (index === null) return;

    this._cueIndex = index;
    this._cueIsInsert = fromZone !== this;
    this.showCueCard();
  }
  handleDragOver(gameObject) {
    const comp = InputCardComponent.getComp(gameObject);
    const fromZone = comp?.originalZone;

    const index = this.getDropCueIndex(gameObject, fromZone);

    if (index === null) return;

    if (this._cueIndex !== index) {
      this._cueIndex = index;
      this.showCueCard();
    }
  }
  handleDragLeave(gameObject) {
    const comp = InputCardComponent.getComp(gameObject);
    const fromZone = comp?.originalZone;

    if (this !== fromZone) {
      this.hideCueCard(); // no-op drop or invalid
      return;
    }
  }
  handleDrop(gameObject) {
    const comp = InputCardComponent.getComp(gameObject);
    const fromZone = comp?.originalZone;

    if (this._cueIndex === null || this === fromZone) {
      this.hideCueCard(); // no-op drop or invalid
      return;
    }

    this.removeCard(gameObject);
    this.cards.splice(this._cueIndex, 0, gameObject);

    this.add(gameObject);
    gameObject.parentZone = this;
    gameObject.parentContainer = this;

    this.hideCueCard();
    this.layoutCards();
  }
  createCueCard() {
    this.cueCard = new BaseCard({ scene: this.scene });
    this.cueCard.setAlpha(0.5);
    this.cueCard.cardBody.setFillStyle(0xff0000, 1);
    this.cueCard.visible = false;
    this.cueCard.isCueCard = true;

    this.add(this.cueCard);
    this.cueCard.parentContainer = this
  }
  getDropCueIndex(card, fromZone) {
    if (fromZone === this) {
      // Same zone → no visual cue or change needed
      return null;
    }

    if (this.playerSortable) {
      return this.calculateInsertIndex(card);
    }

    // Not sortable: treat as shift/push
    return this.defaultCueMode === 'shift' ? 0 : this.cards.length;
  }
  showCueCard() {
    const { SHORTER_DURATION } = CARD_TWEENS
    const { CUE_ALPHA } = CARD_RECT_STYLE
    this.cueCard.visible = true;
    this.scene.tweens.add({
      targets: this.cueCard,
      alpha: { from: 0, to: CUE_ALPHA },
      duration: SHORTER_DURATION
    })
    this.layoutCards();
    this.sortChildren();
  }
  hideCueCard() {
    const { SHORTER_DURATION } = CARD_TWEENS
    const { CUE_ALPHA } = CARD_RECT_STYLE
    this._cueIndex = null;
    this._cueIsInsert = false;
    this.scene.tweens.add({
      targets: this.cueCard,
      alpha: { from: CUE_ALPHA, to: 0 },
      onComplete: function (cueCard) {
        cueCard.visible = false;
      },
      onCompleteParams: [this.cueCard],
      duration: SHORTER_DURATION
    })
    this.layoutCards();
  }
  addCard(card) {
    if (this.cards.includes(card)) return;

    this.cards.push(card);
    this.add(card);
    card.parentZone = this;
    card.parentContainer = this;

    this.layoutCards();
    InputCardComponent.getComp(card)?.refreshPosition();
  }
  removeCard(card) {
    const index = this.cards.indexOf(card);
    if (index !== -1) {
      this.cards.splice(index, 1);
      this.remove(card);
    }
    this.layoutCards();
  }
  transferCardFromZone(oldZone, card) {
    if (!oldZone) return this.addCard(card);

    const worldX = card.getWorldTransformMatrix().tx;
    const worldY = card.getWorldTransformMatrix().ty;

    const local = worldToLocal(worldX, worldY, this);
    card.setPosition(local.x, local.y);

    InputCardComponent.getComp(card)?.refreshPosition();

    oldZone.removeCard(card);
  }
  calculateInsertIndex(gameObject) {
    const local = this.worldToLocal(gameObject.x, gameObject.y);
    let index = this.cards.length;

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      if (local.x < card.x) {
        index = i;
        break;
      }
    }

    return index;
  }
  getBoundsRect() {
    return new Phaser.Geom.Rectangle(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }
  worldToLocal(worldX, worldY) {
    const matrix = new Phaser.GameObjects.Components.TransformMatrix();
    this.getWorldTransformMatrix(matrix);
    matrix.invert();
    const local = matrix.transformPoint(worldX, worldY);
    return new Phaser.Math.Vector2(local.x, local.y);
  }
  sortChildren() {
    this.list.sort((a, b) => {
      const aDepth = a.depth ?? 0;
      const bDepth = b.depth ?? 0;
      return aDepth - bDepth;
    });
  }
  layoutCards() {
    const layoutCount = this.cards.length + (this._cueIsInsert ? 1 : 0);
    if (layoutCount === 0) return;

    const { CARD_BASE_SIZE, WIDTH_SCALE } = CARD_RECT_STYLE;
    const cardWidth = CARD_BASE_SIZE * WIDTH_SCALE;
    const availableWidth = this.width - cardWidth * 2;

    const spacing = layoutCount > 1
      ? Math.min(cardWidth * 1.25, availableWidth / (layoutCount - 1))
      : 0;

    const totalWidth = (layoutCount - 1) * spacing;
    const startX = -totalWidth / 2;

    let layoutIndex = 0;

    for (let i = 0; i < this.cards.length; i++) {

      const card = this.cards[i];
      const targetX = startX + layoutIndex * spacing;
      const targetY = 0;

      const inputComp = InputCardComponent.getComp(card);
      if (inputComp) {
        inputComp.currentX = card.x;
        inputComp.currentY = card.y;
        inputComp.targetX = targetX;
        inputComp.targetY = targetY;
        inputComp.shouldUpdate = true;
      } else {
        card.setPosition(targetX, targetY);
      }

      card.setDepth(i);
      card.emit?.('positionChanged');

      if (this.cueCard.visible && i === this._cueIndex) {
        const cueX = targetX;
        const cueY = targetY-10;
        this.cueCard.setPosition(cueX, cueY);
        this.cueCard.setDepth(i);
        layoutIndex++;
        continue;
      }
      layoutIndex++;
    }
    // Special case: cue at the very end
    if (this.cueCard.visible && this._cueIndex === this.cards.length) {
      const cueX = startX + layoutIndex * spacing;
      this.cueCard.setPosition(cueX, -10);
      this.cueCard.setDepth(layoutIndex);
    }
    this.sortChildren();
  }
}
