import Phaser from 'phaser';
import { worldToLocal } from '../../utils';
import { InputCardComponent } from '../../components/input-component';
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

    // handleDragEnter() { return; }
    // handleDragLeave() { return; }
    // handleDragOver() { return; }
    // handleDrop() { return; }
    // insertCueCardAt() { return; }
    // removeCueCard() { return; }
    // getDropCueIndex() { return; }
    // showCueCard() { return; }

    layoutCards() {
        const layoutCount = this.cards.length;
        if (layoutCount === 0) return;

        const { CARD_BASE_WIDTH, WIDTH_SCALE } = CARD_RECT_STYLE
        const cardWidth = CARD_BASE_WIDTH * WIDTH_SCALE

        const availableWidth = Math.max(this.width - cardWidth * 2, 0);

        const spacing = 1.25

        const totalWidth = availableWidth;
        const startX = -totalWidth / 2;
        const startY = 0;

        for (let i = 0; i < layoutCount; i++) {
            const card = this.cards[i];
            const x = startX;
            const y = startY - i * spacing;

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