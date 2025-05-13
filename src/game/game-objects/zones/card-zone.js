import Phaser from 'phaser';
import { worldToLocal } from '../../utils';
import { InputCardComponent } from '../../components/input-component';
import { BaseCard } from '../cards/base-card';
import { CARD_RECT_STYLE, CARD_TWEENS } from '../../config';
import { PlayingCardComponent } from '../../components/playing-card-component';

export class CardZone extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, config = {}) {
    super(scene, x, y);
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.cards = [];

    this.defaultCueMode = config.defaultCueMode ?? 'push';
    this.cueIndex = null;

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

  handleDragStart(card) {
    const comp = InputCardComponent.getComp(card);
    if (!comp || !this.cards.includes(card)) return;

    this.originCard = card;
    this.cueIsInsert = false;
    this.cueIndex = this.cards.indexOf(card);
    this.cueCard.setPosition(card.x, card.y);

    const i = this.cards.indexOf(card);
    if (i !== -1) this.cards.splice(i, 1);
    this.cards.splice(this.cueIndex, 0, this.cueCard);

    card.setDepth(9999);
    this.showCueCard();
    this.sortChildren();
  }

  handleDragEnter(card) {
    const comp = InputCardComponent.getComp(card);
    const originalZone = comp?.originalZone;

    if (!comp) return;

    const index = this.getDropCueIndex(card, originalZone);
    if (index === null) return;
    this.cueIndex = index;
    this.cueIsInsert = originalZone !== this;
    const dragIndex = this.cards.indexOf(card);
    if (dragIndex !== -1) {
      this.cards.splice(dragIndex, 1);
    }
    const existingCueIndex = this.cards.indexOf(this.cueCard);
    if (existingCueIndex !== -1) {
      this.cards.splice(existingCueIndex, 1);
    }
    this.cards.splice(this.cueIndex, 0, this.cueCard);
    this.showCueCard();
  }

  handleDragLeave(card) {
    const comp = InputCardComponent.getComp(card);
    if (!comp) return;
    const originalZone = comp.originalZone;
    if (originalZone !== this) {
      this.removeCueCard();
      this.hideCueCard();
    }
  }

  handleDrop(card) {
    const comp = InputCardComponent.getComp(card);
    const fromZone = comp?.originalZone;

    if (!comp || this._cueIndex === null) return;

    const isSameZone = (this === fromZone);

    if (isSameZone && !this.cueIsInsert) {
      this.removeCueCard();
      this.hideCueCard();
          console.log(this.cards)

      return;
    }
    
    this.removeCard(card);
    console.log(isSameZone)

    const cueIdx = this.cards.indexOf(this.cueCard);
    if (cueIdx !== -1) {
      this.cards.splice(cueIdx, 1);
      this.cards.splice(cueIdx, 0, card);
    } else {
      this.cards.splice(this.cueIndex, 0, card); // fallback
    }

    this.add(card);
    card.parentZone = this;
    card.parentContainer = this;

    this.cueIndex = null;
    this.cueIsInsert = false;
    this.cueCard.visible = false;

    this.layoutCards();
  }

  insertCueCardAt(index) {
    const existing = this.cards.indexOf(this.cueCard);
    if (existing !== -1) this.cards.splice(existing, 1);
    this.cards.splice(index, 0, this.cueCard);
  }

  removeCueCard() {
    const index = this.cards.indexOf(this.cueCard);
    if (index !== -1) this.cards.splice(index, 1);
  }

  createCueCard() {
    this.cueCard = new BaseCard({ scene: this.scene });
    this.cueCard.setAlpha(0.5);
    this.cueCard.cardBody.setFillStyle(0xff0000);
    this.cueCard.visible = false;
    this.cueCard.isCueCard = true;

    this.add(this.cueCard);
    this.cueCard.parentContainer = this
  }

  getDropCueIndex(gameObject, fromZone) {
    if (fromZone === this && this.defaultCueMode !== 'sortable') return null;
    if (this.defaultCueMode === 'shift') return 0;
    if (this.defaultCueMode === 'push') return this.cards.length;
    if (this.defaultCueMode === 'sortable') return this.calculateInsertIndex(gameObject);
    return this.cards.length;
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
  }

  hideCueCard(skipRemove = false) {
    const { SHORTER_DURATION } = CARD_TWEENS;
    const { CUE_ALPHA } = CARD_RECT_STYLE;
    this.cueIndex = null;
    this.cueIsInsert = false;

    if (!skipRemove) this.removeCueCard();

    this.scene.tweens.add({
      targets: this.cueCard,
      alpha: { from: CUE_ALPHA, to: 0 },
      onComplete: (cueCard) => { cueCard.visible = false; },
      onCompleteParams: [this.cueCard],
      duration: SHORTER_DURATION
    });

    this.layoutCards();
  }

  addCardAt(card, index) {
    if (this.cards.includes(card)) return;
    this.cards.splice(index, 0, card);
    if (!this.list.includes(card)) this.list.splice(index, 0, card);
    card.parentZone = this;
    card.parentContainer = this;
    this.layoutCards();
    InputCardComponent.getComp(card)?.refreshPosition();
  }

  addCard(card) {
    this.addCardAt(card, this.cueIndex ?? this.cards.length);
  }

  removeCard(card) {
    const index = this.cards.indexOf(card);
    if (index !== -1) this.cards.splice(index, 1);
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
      if (card === this.cueCard) continue;
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
    const layoutCount = this.cards.length;
    if (layoutCount === 0) return;

    const { CARD_BASE_SIZE, WIDTH_SCALE } = CARD_RECT_STYLE;
    const cardWidth = CARD_BASE_SIZE * WIDTH_SCALE;
    const availableWidth = this.width - cardWidth * 2;

    const spacing = layoutCount > 1
      ? Math.min(cardWidth * 1.25, availableWidth / (layoutCount - 1))
      : 0;

    const totalWidth = (layoutCount - 1) * spacing;
    const startX = -totalWidth / 2;
    const targetY = 0;

    for (let i = 0; i < layoutCount; i++) {
      const card = this.cards[i];
      const x = startX + i * spacing;
      const y = card === this.cueCard ? targetY - 10 : targetY;

      const inputComp = InputCardComponent.getComp(card);
      if (inputComp) {
        inputComp.currentX = card.x;
        inputComp.currentY = card.y;
        inputComp.targetX = x;
        inputComp.targetY = y;
        inputComp.shouldUpdate = true;
      } else {
        card.setPosition(x, y);
      }

      card.setDepth(i);
      card.emit?.('positionChanged');
    }

    this.sortChildren();
  }
}
