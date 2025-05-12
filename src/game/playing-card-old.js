import { BaseCard } from "./game-objects/base-card"
import { CARD_RECT_STYLE, CARD_TEXT_STYLE } from './config'

export class PlayingCard extends BaseCard {
    constructor({ scene, cardSuit, cardValue }) {
        super({ scene })
        this.suit = cardSuit
        this.value = cardValue
        this.text = `${cardValue.label} of ${cardSuit.label}`
        this.label = `${cardSuit.label}${cardValue.label}`
        this.cardText = [`${cardValue.label}`, `${cardSuit.label}`]

        this.createCardText()
    }
    createCardText() {
        const { CARD_BASE_SIZE } = CARD_RECT_STYLE

        const textStyle = {
            ...CARD_TEXT_STYLE,
            fontSize: CARD_BASE_SIZE * 0.75,
            lineSpacing: -CARD_BASE_SIZE * 0.075,
            color: this.suit.gameColor.hex,
        }

        const textureKey = `_${this.label}`
        if (!this.scene.textures.exists(textureKey)) {
            const textObject = new Phaser.GameObjects.Text(this.scene, 0, 0, this.cardText, textStyle);
            this.scene.textures.addCanvas(textureKey, textObject.canvas)
        }

        const upsideX = this.cardBody.width / 2 - 2;
        const upsideY = this.cardBody.height / 2 - 1;
        const uprightX = -upsideX;
        const uprightY = -upsideY;
        this.textImageUpright = new Phaser.GameObjects.Image(this.scene, uprightX, uprightY, `_${this.label}`)
            .setOrigin(0);
        this.textImageUpside = new Phaser.GameObjects.Image(this.scene, upsideX, upsideY, `_${this.label}`)
            .setRotation(Math.PI)
            .setOrigin(0);

        this.add([this.textImageUpright, this.textImageUpside])

    }
}