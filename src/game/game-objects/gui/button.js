import Phaser from 'phaser';
import { CARD_TWEENS, PHASER_COLORS } from '../../config';
import { InputComponent } from '../../components/input-component';
const { RED, BLUE } = PHASER_COLORS;
const { CLICKED_SCALE, HOVERED_SCALE, STANDARD_SCALE, SHORT_DURATION, DEFAULT_EASE } = CARD_TWEENS;

export class Button extends Phaser.GameObjects.Container {
    constructor({ scene, idleColor, hoverColor, clickedColor, text }) {
        super(scene, 0, 0);
        this.scene = scene;
        this.components = [];

        this.idleColor = idleColor;
        this.hoverColor = hoverColor;
        this.clickedColor = clickedColor;

        this.createButtonBody(text);

        this.addComponent(InputComponent, {
            hoverable: true,
            draggable: false,
            clickable: true,
        });
    }

    createButtonBody(text) {
        this.graphic = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 100, 32, this.idleColor).setOrigin(0.5);
        this.text = new Phaser.GameObjects.Text(this.scene, 0, 0, text, {
            fontFamily: 'pixellari',
            fontSize: 16,
        }).setOrigin(0.5);

        this.add(this.graphic)
        this.add(this.text)

        this.width = this.graphic.width
        this.height = this.graphic.height
        this.setSize(this.graphic.width, this.graphic.height);

    }
    changeApperance(fillStyle, tweenConfig) {
        if (fillStyle) this.graphic.setFillStyle(fillStyle);
        if (tweenConfig) this.scene.tweens.add(tweenConfig);
    }
    onPointerOver(pointer) {
        this.changeApperance(this.hoverColor, {
            targets: this,
            scale: HOVERED_SCALE,
            ease: DEFAULT_EASE,
            duration: SHORT_DURATION,
        })
    }
    onPointerDown(pointer) {
        this.changeApperance(this.clickedColor, {
            targets: this,
            scale: CLICKED_SCALE,
            ease: DEFAULT_EASE,
            duration: SHORT_DURATION,
        })

    }
    onPointerUp(pointer) {
        this.changeApperance(this.hoverColor, {
            targets: this,
            scale: HOVERED_SCALE,
            ease: DEFAULT_EASE,
            duration: SHORT_DURATION,
        })
    }
    onPointerOut(pointer) {
        this.changeApperance(this.idleColor, {
            targets: this,
            scale: STANDARD_SCALE,
            ease: DEFAULT_EASE,
            duration: SHORT_DURATION,
        })
    }
    addComponent(ComponentClass, ...args) {
        const comp = new ComponentClass(this, ...args);
        this.components.push(comp);
    }
}