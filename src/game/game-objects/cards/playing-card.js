import { BaseCard } from './base-card';
import { PlayingCardComponent } from '../../components/playing-card-component';
import { CARD_RECT_STYLE, CARD_TEXT_STYLE } from '../../config';
import { InputCardComponent } from '../../components/input-component';
export class PlayingCard extends BaseCard {
    constructor({ scene, cardSuit, cardValue }) {
        super({ scene });

        this.addComponent(PlayingCardComponent, cardSuit, cardValue);
        this.addComponent(InputCardComponent);
        this.createCardText()
    }

    createCardText() {
        const { CARD_BASE_SIZE, TEXT_PADDING } = CARD_RECT_STYLE

        const playingCardComp = PlayingCardComponent.getComp(this)

        const textStyle = {
            ...CARD_TEXT_STYLE,
            fontSize: Math.round(CARD_BASE_SIZE * 0.75),
            lineSpacing: -CARD_BASE_SIZE * 0.075,
            color: playingCardComp.suit.gameColor.hex
        }

        const textureKey = `_${playingCardComp.label}`;
        if (!this.scene.textures.exists(textureKey)) {
            const tempText = this.scene.add.text(0, 0, playingCardComp.textureKey, textStyle).setOrigin(0.5)
            const rt = this.scene.make.renderTexture({
                x: 0,
                y: 0,
                width: this.cardBody.width,
                height: this.cardBody.height,
            }, false);
            rt.draw(tempText, tempText.width/2 + TEXT_PADDING, tempText.height/2 + TEXT_PADDING);
            rt.draw(tempText.setRotation(Math.PI), this.cardBody.width - tempText.width/2 - TEXT_PADDING, this.cardBody.height - tempText.height/2 - TEXT_PADDING);
            rt.saveTexture(textureKey);
            tempText.destroy();
            rt.destroy();
        }
        this.playingCardText = new Phaser.GameObjects.Image(this.scene, 0, 0, textureKey)
            .setDepth(1)
        this.add([this.playingCardText])
    }
}
