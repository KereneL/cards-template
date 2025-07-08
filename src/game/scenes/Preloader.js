import { Scene } from 'phaser';
import { CARD_RECT_STYLE, CARD_SUITES, CARD_VALUES } from '../config';

const SPRITESHEET_URL = './assets/snoblin_full_cards.png'
const SPRITESHEET_KEY = 'spritesheet-cards'
export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
        this.load.on('progress', (progress) => { bar.width = 4 + (460 * progress) });
    }

    preload ()
    {
        this._loadSpritesheet();
        this._loadFonts();
    }

    create ()
    {
        this._buildCards();
        this.scene.start('Game');
    }

    _loadFonts() {
        this.load.setPath('./fonts');
        this.load.font('dicier', './Dicier-Pixel.otf');
        this.load.font('pixellari', './Pixellari.ttf');
    }
    _loadSpritesheet() {
        this.load.setPath();
        this.load.spritesheet(SPRITESHEET_KEY, SPRITESHEET_URL, {
            frameWidth: 39,
            frameHeight: 55,
            spacing: 1
        })
    }
    _buildCards() {
        const texture = this.textures.get(SPRITESHEET_KEY);
        for (const suitKey in CARD_SUITES) {
            for (const valueKey in CARD_VALUES) {
                const cSuit = CARD_SUITES[suitKey]
                const { spritesheetRow } = cSuit
                const cValue = CARD_VALUES[valueKey]
                const { indexInSpritesheet } = cValue
                const ssIndex = spritesheetRow * 13 + indexInSpritesheet
                const textureKey = `${cValue.texturePhrase}${cSuit.texturePhrase}`;
                const cardKey = `card_${textureKey}`;
                this.createTextureFromSpritesheetFrame(ssIndex, cardKey)
            }
        };
        
        [[90, `blank_card`],
        [96, `back_red`],
        [97, `back_blue`],
        [98, `back_dark`],
        [99, `back_green`],
        [89, `joker_A`],
        [102, `joker_B`],
        [103, `card_shadow`]
        ].forEach((text) => {
            if (!texture.get(text[0])) return;
            const textureKey = text[1];
            this.createTextureFromSpritesheetFrame(text[0], textureKey)
        })
    }

    createTextureFromSpritesheetFrame(frameIndex, key) {
        const { CARD_BASE_WIDTH, CARD_BASE_HEIGHT, } = CARD_RECT_STYLE

        const texture = this.textures.get(SPRITESHEET_KEY);
        const originalFrame = texture.get(frameIndex);
        if (originalFrame) {
            const rt = this.make.renderTexture({ x: 0, y: 0, width: CARD_BASE_WIDTH, height: CARD_BASE_HEIGHT }, false);
            rt.drawFrame(SPRITESHEET_KEY, frameIndex)
            rt.saveTexture(key);
            rt.destroy();
        }
    }
}
