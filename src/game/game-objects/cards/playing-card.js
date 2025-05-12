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
        const { CARD_BASE_SIZE } = CARD_RECT_STYLE

        const playingCardComp = PlayingCardComponent.getComp(this)

        const textStyle = {
            ...CARD_TEXT_STYLE,
            fontSize: CARD_BASE_SIZE * 0.75,
            lineSpacing: -CARD_BASE_SIZE * 0.075,
            color: playingCardComp.suit.gameColor.hex
        }

        const textureKey = `_${playingCardComp.label}`;
        if (!this.scene.textures.exists(textureKey)) {
            const tempText = this.scene.add.text(0, 0, playingCardComp.label, textStyle).setOrigin(0);
            const rt = this.scene.make.renderTexture({
                x: 0,
                y: 0,
                width: tempText.width,
                height: tempText.height,
            }, false);
            rt.draw(tempText, 0, 0);
            rt.saveTexture(textureKey);
            tempText.destroy();
            rt.destroy();
        }

        const upsideX = this.cardBody.width / 2 - 2;
        const upsideY = this.cardBody.height / 2 - 1;
        const uprightX = -upsideX;
        const uprightY = -upsideY;
        this.textImageUpright = new Phaser.GameObjects.Image(this.scene, uprightX, uprightY, textureKey)
            .setOrigin(0)
            .setDepth(10)
        this.textImageUpside = new Phaser.GameObjects.Image(this.scene, upsideX, upsideY, textureKey)
            .setRotation(Math.PI)
            .setOrigin(0)
        this.add([this.textImageUpright, this.textImageUpside])
    }
}
