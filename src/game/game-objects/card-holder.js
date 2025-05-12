import Phaser from 'phaser';
import { CenteredRowLayoutComponent } from '../components/layout-comps/centered-row-component';

export class CardHolder extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height) {
        super(scene, x, y);
        this.scene = scene;
        this.cards = [];

        this.backgroundRect = scene.add.rectangle(0, 0, width, height, 0x000000, 0.1);
        this.backgroundRect.setOrigin(0.5);
        this.add(this.backgroundRect);

        scene.add.existing(this);
    }

    addCards(...cards) {
        for (const card of cards) {
            this.cards.push(card);
            this.add(card);
        }
        this.layoutCards();
    }

    layoutCards() {
        const layout = CenteredRowLayoutComponent.getComp(this);
        if (layout) {
            layout.layout(this.cards);
        }
    }

    getBoundsRect() {
        return new Phaser.Geom.Rectangle(
            this.x - this.backgroundRect.width / 2,
            this.y - this.backgroundRect.height / 2,
            this.backgroundRect.width,
            this.backgroundRect.height
        );
    }
}
