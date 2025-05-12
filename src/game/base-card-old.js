import Phaser from 'phaser';
import { CARD_RECT_STYLE, CARD_TWEENS } from './config'

class BaseCard extends Phaser.GameObjects.Container {
    constructor({ scene }) {
        super(scene, 0, 0)
        this.createCardBody()
        this.on('addedtoscene', () => {
            this.createListeners()
        });
    }
    createCardBody() {
        const { CARD_BASE_SIZE, CARD_STROKE_WIDTH } = CARD_RECT_STYLE
        this.cardBody = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, CARD_BASE_SIZE * 2.5, CARD_BASE_SIZE * 3.5, 0xdddddd, 1)
            .setStrokeStyle(CARD_STROKE_WIDTH, 0x000000)
        this.add(this.cardBody)
    }
    createListeners() {
        let targetX = this.x;
        let targetY = this.y;
        let currentX = this.x;
        let currentY = this.y;
        let currentRotation = 0;
        let rotationTarget = 0;
        let lastPointerX = null;
        let velocityX = 0;
        let isDragging = false;

        const { DAMP_FACTOR, IDLE_THRESHOLD, ROTATION_EASE_SOFT, ROTATION_EASE_HARD,
            LONGER_DURATION, LONG_DURATION, SHORT_DURATION, EASE,
            IDLE_SCALE, HOVERED_SCALE, DRAGGED_SCALE, MAX_ROTATE } = CARD_TWEENS

        this.setInteractive({
            draggable: true,
            hitArea: new Phaser.Geom.Rectangle(-this.cardBody.width / 2, -this.cardBody.height / 2, this.cardBody.width, this.cardBody.height),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains
        })
            .on('pointerover', function () {
                this.scene.tweens.add({
                    targets: this,
                    scale: HOVERED_SCALE,
                    ease: EASE,
                    duration: SHORT_DURATION,
                })
            }, this)
            .on('pointerout', function () {
                this.scene.tweens.add({
                    targets: this,
                    scale: IDLE_SCALE,
                    ease: EASE,
                    duration: SHORT_DURATION,
                })
            }, this)
            .on('dragstart', function (pointer, dragX, dragY) {
                isDragging = true;

                targetX = this.x;
                targetY = this.y;
                currentX = this.x;
                currentY = this.y;

                lastPointerX = pointer.x;
                velocityX = 0;
            }, this)
            .on('drag', function (pointer, dragX, dragY) {
                targetX = dragX;
                targetY = dragY;
            }, this)
            .on('dragend', function (pointer, dragX, dragY) {
                isDragging = false;
                rotationTarget = 0;
                targetX = this.input.dragStartX;
                targetY = this.input.dragStartY;
                this.scene.tweens.add({
                    targets: this,
                    scale: IDLE_SCALE,
                    ease: EASE,
                    duration: SHORT_DURATION,
                })
            }, this);

        this.scene.time.addEvent({
            loop: true,
            delay: 16,
            callback: function () {
                const positionEase = 0.25;
                currentX = Phaser.Math.Linear(currentX, targetX, positionEase);
                currentY = Phaser.Math.Linear(currentY, targetY, positionEase);
                this.setPosition(currentX, currentY);

                if (isDragging) {
                    const pointer = this.scene.input.activePointer;

                    if (lastPointerX !== null) {
                        const deltaX = pointer.x - lastPointerX;
                        velocityX = Phaser.Math.Linear(velocityX, deltaX, 0.5); 
                    }
                    lastPointerX = pointer.x;

                    let targetRotation = 0;
                    if (Math.abs(velocityX) > IDLE_THRESHOLD) {
                        targetRotation = Phaser.Math.Clamp(velocityX * DAMP_FACTOR, -MAX_ROTATE, MAX_ROTATE);
                    }

                    currentRotation = Phaser.Math.Linear(currentRotation, targetRotation, ROTATION_EASE_SOFT);
                    this.setRotation(currentRotation);

                    if (Math.abs(velocityX) < IDLE_THRESHOLD && Math.abs(currentRotation) < 0.01) {
                        currentRotation = 0;
                        this.setRotation(0);
                    }
                } else {
                    {
                        currentRotation = Phaser.Math.Linear(currentRotation, rotationTarget, ROTATION_EASE_HARD);
                        this.setRotation(currentRotation);

                        if (Math.abs(currentRotation - rotationTarget) < 0.01) {
                            currentRotation = rotationTarget;
                            this.setRotation(rotationTarget);
                        }
                    }
                }
            },
            callbackScope: this
        });
    }

}