import { BaseZone } from './base-zone';
import { InteractiveZoneComponent } from '../../components/layout-comps/interactive-zone-component';
import { CARD_RECT_STYLE } from '../../config';
import { InputCardComponent } from '../../components/input-component';

export class LineZone extends BaseZone {
  constructor(scene, x, y, width, height, onCardDropped) {
    super(scene, x, y, width, height);

    this.addComponent(InteractiveZoneComponent, (card, zone) => {
      onCardDropped?.(card, zone);
    });
  }

layoutCards() {
  const { CARD_BASE_SIZE, WIDTH_SCALE } = CARD_RECT_STYLE;

  const cardWidth = CARD_BASE_SIZE * WIDTH_SCALE;
  const cardCount = this.cards.length;

  if (cardCount === 0) return;

  const totalCardWidth = cardWidth * cardCount;
  const availableWidth = this.width - cardWidth * 2;

  const spacing = cardCount > 1
    ? Math.min(cardWidth * 1.25, availableWidth / (cardCount - 1))
    : 0;

  const totalWidth = (cardCount - 1) * spacing;
  const startX = -totalWidth / 2;

  for (let i = 0; i < cardCount; i++) {
    const card = this.cards[i];
    const targetX = startX + i * spacing;
    const targetY = 0;

    const inputComp = InputCardComponent.getComp(card);
    if (inputComp) {
      inputComp.currentX = card.x;
      inputComp.currentY = card.y;
      inputComp.targetX = targetX;
      inputComp.targetY = targetY;
    }

    card.emit?.('positionChanged');
  }
}
}