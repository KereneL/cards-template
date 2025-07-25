import { BaseCard } from './base-card';
import { PlayingCardComponent } from '../../components/playing-card-component';
import { CARD_RECT_STYLE, CARD_TEXT_STYLE } from '../../config';
import { InputCardComponent } from '../../components/input-component';
const SPRITESHEET_KEY = 'spritesheet-cards'

export class PlayingCard extends BaseCard {
    constructor({ scene, cardSuit, cardValue }) {
        super({ scene });

        this.addComponent(PlayingCardComponent, cardSuit, cardValue);
        this.addComponent(InputCardComponent);
        this.name = `${cardValue.label}${cardSuit.label}`
        this.type = 'PlayingCard'
        this.loadTexture()
    }


    loadBackTexture() {
        this.cardFace.setTexture(SPRITESHEET_KEY, 96, false, false)
    }
    loadTexture() {
        const { CARD_BASE_WIDTH, CARD_BASE_HEIGHT, WIDTH_SCALE, HEIGHT_SCALE } = CARD_RECT_STYLE
        const cardWidth = CARD_BASE_WIDTH * WIDTH_SCALE
        const cardHeight = CARD_BASE_HEIGHT * HEIGHT_SCALE

        const comp = PlayingCardComponent.getComp(this)
        const { value, suit } = comp
        const textureKey = `texture_${value.texturePhrase}${suit.texturePhrase}`
        this.cardDeco = new Phaser.GameObjects.Plane(this.scene, 0, 0, textureKey, 0, 1, 1)
            .setDisplaySize(cardWidth, cardHeight)
            .setPipeline('Light2D');

        this.cardBody.add(this.cardDeco)
        this.cardFace.setTexture(SPRITESHEET_KEY, 96, false, false)
    }
}
