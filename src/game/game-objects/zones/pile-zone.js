import Phaser from 'phaser';
import { worldToLocal } from '../../utils';
import { InputComponent } from '../../components/input-component';
import { BaseCard } from '../cards/base-card';
import { CARD_RECT_STYLE, CARD_TWEENS } from '../../config';
import { PlayingCardComponent } from '../../components/playing-card-component';
import { CardZone } from './card-zone';

export class PileZone extends CardZone {
    constructor(scene, x, y, width, height, config = {}) {
        super(scene, x, y, width, height, config);

        this.defaultCueMode = 'push'; //or push or shift
        this.allowDroppingCards = false;
        this.allowTakingCards = false;

    }
    layoutCards() {
        const layoutCount = this.cards.length;
        if (layoutCount === 0) return;

        const { CARD_BASE_WIDTH, WIDTH_SCALE } = CARD_RECT_STYLE
        const cardWidth = CARD_BASE_WIDTH * WIDTH_SCALE

        const availableWidth = this.width - cardWidth * 2;

        const spacingX = 0.75
        const spacingY = -0.3

        const totalWidth = (layoutCount - 1) * spacingX;
        const startX = -totalWidth / 2;
        const targetY = 20;

        for (let i = 0; i < layoutCount; i++) {
            const card = this.cards[i];
            const x = startX + i * spacingX;
            const y = targetY + i * spacingY;

            const inputComp = InputComponent.getComp(card);
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