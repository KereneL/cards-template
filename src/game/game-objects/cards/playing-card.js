import { BaseCard } from './base-card';
import { PlayingCardComponent } from '../../components/playing-card-component';
import { CARD_RECT_STYLE, CARD_TEXT_STYLE } from '../../config';
import { InputCardComponent } from '../../components/input-component';

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
        const textureKey = `back_red`
        this.cardBody.setTexture(textureKey, 0, true, false)
    }
    loadTexture() {
        const comp = PlayingCardComponent.getComp(this)
        const { value, suit } = comp
        const textureKey = `card_${value.texturePhrase}${suit.texturePhrase}`
        this.cardBody.setTexture(textureKey, 0, true, false)
        this.add(this.cardBody)
    }
}
