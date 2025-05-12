import Phaser from 'phaser';
import { worldToLocal } from '../../utils'
import { InputCardComponent } from '../../components/input-component';

export class BaseZone extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height) {
    super(scene, x, y);
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.components = [];
    this.cards = [];

    this.background = scene.add.rectangle(0, 0, width, height, 0x000000, 0.1).setOrigin(0.5);
    this.add(this.background);

    scene.add.existing(this);
  }

  addComponent(ComponentClass, ...args) {
    const comp = new ComponentClass(this, ...args);
    this.components.push(comp);
  }

  addCard(card) {
    if (this.cards.includes(card)) return;

    this.cards.push(card);
    this.add(card);
    card.parentZone = this;

    const inputComp = InputCardComponent.getComp(card);
    if (inputComp) inputComp.refreshPosition();

    this.layoutCards?.();
  }


  removeCard(card) {
    const index = this.cards.indexOf(card);
    if (index !== -1) {
      this.cards.splice(index, 1);
      this.remove(card);
    }

    this.layoutCards?.();
  }

  transferCardFromZone(oldZone, card) {
    if (!oldZone) return this.addCard(card);

    const worldX = card.getWorldTransformMatrix().tx;
    const worldY = card.getWorldTransformMatrix().ty;

    const local = worldToLocal(worldX, worldY, this);
    card.setPosition(local.x, local.y);

    const inputComp = InputCardComponent.getComp(card);
    if (inputComp) inputComp.refreshPosition();

    oldZone.removeCard(card);
    this.addCard(card);
  }

}
