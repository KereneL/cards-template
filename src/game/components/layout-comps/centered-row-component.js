import { BaseComponent } from '../base-component';
import { InputCardComponent } from '../input-component';
import { CARD_RECT_STYLE } from '../../config';

export class CenteredRowLayoutComponent extends BaseComponent {
    constructor(gameObject) {
        super(gameObject);
    }

    layout(cards = this.gameObject.cards) {
        if (!this.gameObject || !cards || cards.length === 0) return;

        const {CARD_BASE_SIZE, WIDTH_SCALE} = CARD_RECT_STYLE
        const bounds = this.gameObject.getBoundsRect();
        const rectWidth = bounds.width;

        const cardWidth = CARD_BASE_SIZE  * WIDTH_SCALE
        const n = cards.length;

        const sidePadding = cardWidth * 1; 
        const availableWidth = rectWidth - 2 * sidePadding;

        if (n === 1) {
            cards[0].setPosition(0, 0);
            cards[0].emit?.('positionChanged');
            return;
        }

        const spacing = Math.max((availableWidth) / (n - 1), 0); 
        const startX = -rectWidth / 2 + sidePadding;

        const centerY = 0;

        for (let i = 0; i < n; i++) {
            const card = cards[i];
            const targetX = startX + i * spacing;

            card.setPosition(targetX, centerY);
            card.emit?.('positionChanged');

        }
    }
}
