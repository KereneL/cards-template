import Phaser from 'phaser';
import { CARD_SUITES, CARD_VALUES, CARD_TWEENS } from '../config';
import { createRegularDeck, BaseDeck } from '../game-objects/base-deck';
import { PlayingCardComponent } from '../components/playing-card-component';
import { InputCardComponent } from '../components/input-component';
import { DropZoneComponent } from '../components/layout-comps/drop-zone-component';
import { LineZone } from '../game-objects/zones/line-zone';
import { CardPhysicsSystem } from '../utils'
export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background').setAlpha(0.25);
        this.input.dragDistanceThreshold = 2;

        this.createDeck();
        this.deck.shuffle();

        this.enemy = new LineZone(this, 512, 250, 600, 150, (card, zone) => {
            const cardName = PlayingCardComponent.getComp(card).name
            console.log(`Dropped ${cardName || 'card'} on enemy hand`);
        });

        this.tableu = new LineZone(this, 512, 425, 600, 150, (card, zone) => {
            const cardName = PlayingCardComponent.getComp(card).name
            console.log(`Dropped ${cardName || 'card'} on tableu`);
        });

        this.hand = new LineZone(this, 512, 600, 600, 150, (card, zone) => {
            const cardName = PlayingCardComponent.getComp(card).name
            console.log(`Dropped ${cardName || 'card'} on hand`);
        });

        this.dealSomeCards(12);
        this.applyListeners();
    }

    createDeck() {
        const deckCardsArr = createRegularDeck(this);
        this.deck = new BaseDeck(this, deckCardsArr);
    }

    dealSomeCards(howManyCards) {
        const selected = [];
        const deckCards = this.deck.getChildren();

        for (let i = 0; i < howManyCards; i++) {
            const card = deckCards[i];
            selected.push(card);
        }

        Phaser.Utils.Array.StableSort(selected, (a, b) => {
            const aComp = PlayingCardComponent.getComp(a);
            const bComp = PlayingCardComponent.getComp(b);
            return bComp.value.sequenceAs[0] - aComp.value.sequenceAs[0];
        });

        for (const card of selected) {
            card.addComponent(InputCardComponent);
            this.hand.addCard(card);
        }

        this.activeCards = selected;
    }

    applyListeners() {
        const { SHORT_DURATION, DRAGGED_SCALE, HOVERED_SCALE, IDLE_SCALE, EASE } = CARD_TWEENS;

        this.input.on('gameobjectover', function (pointer, gameObject, event) {
            const comp = InputCardComponent.getComp(gameObject);
            if (!comp || !comp.hoverable) return;

            this.tweens.add({
                targets: gameObject,
                scale: HOVERED_SCALE,
                ease: EASE,
                duration: SHORT_DURATION,
            })
        }, this);
        this.input.on('gameobjectout', function (pointer, gameObject, event) {
            const comp = InputCardComponent.getComp(gameObject);
            if (!comp || !comp.hoverable) return;

            this.tweens.add({
                targets: gameObject,
                scale: IDLE_SCALE,
                ease: EASE,
                duration: SHORT_DURATION,
            })
        }, this);
        this.input.on('dragstart', (pointer, gameObject) => {
            const comp = InputCardComponent.getComp(gameObject);
            if (!comp) return;

            comp.isDragging = true;
            comp.shouldUpdate = true;
            comp.lastPointerX = pointer.x;

            const topDepth = Math.max(...this.activeCards.map(card => card.depth || 0));
            gameObject.setDepth(topDepth + 1);

            this.tweens.add({
                targets: gameObject,
                scale: DRAGGED_SCALE,
                ease: EASE,
                duration: SHORT_DURATION,
            })

            if (gameObject.cardShadow) {
                this.tweens.add({
                    targets: gameObject.cardShadow,
                    alpha: 0.35,
                    scale: DRAGGED_SCALE,
                    ease: 'Quad.easeOut',
                    duration: SHORT_DURATION,
                });
            }
        }, this);
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            const comp = InputCardComponent.getComp(gameObject);
            if (!comp) return;

            comp.targetX = dragX;
            comp.targetY = dragY;

        }, this);
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            const zoneComp = DropZoneComponent.getComp(dropZone);
            if (!zoneComp) return;

            zoneComp.handleDrop(gameObject);
        });
        this.input.on('dragend', (pointer, gameObject, dropped) => {
            const comp = InputCardComponent.getComp(gameObject);
            if (!comp) return;

            comp.isDragging = false;
            comp.rotationTarget = 0;

            if (!dropped) {
                // Lock physics system temporarily
                comp.physicsEnabled = false;

                // Stop any system-based interpolation
                comp.targetX = comp.currentX;
                comp.targetY = comp.currentY;

                // Store original x position
                const originalX = comp.currentX;

                // Shake the GameObject's position directly
                this.tweens.add({
                    targets: gameObject,
                    x: originalX + 10, // first wiggle
                    duration: 50,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        // Restore position
                        gameObject.setX(originalX);

                        // Reset movement target and re-enable physics
                        comp.targetX = gameObject.input.dragStartX
                        comp.targetY = gameObject.input.dragStartY
                        comp.shouldUpdate = true;
                        comp.physicsEnabled = true;
                    }
                });
            }

            if (gameObject.cardShadow) {
                this.tweens.add({
                    targets: gameObject.cardShadow,
                    alpha: 0,
                    scale: DRAGGED_SCALE,
                    ease: 'Quad.easeOut',
                    duration: SHORT_DURATION,
                });
            }

        }, this);

        // this.timedEvent = this.time.addEvent({
        //     loop: true,
        //     delay: 16,
        //     callback: () => {
        //         for (const card of this.activeCards) {
        //             const comp = InputCardComponent.getComp(card);
        //             if (!comp) continue;

        //             const {
        //                 DAMP_FACTOR, IDLE_THRESHOLD, MAX_ROTATE,
        //                 ROTATION_EASE_SOFT, ROTATION_EASE_HARD,
        //             } = CARD_TWEENS;

        //             comp.currentX = Phaser.Math.Linear(comp.currentX, comp.targetX, 0.25);
        //             comp.currentY = Phaser.Math.Linear(comp.currentY, comp.targetY, 0.25);
        //             card.setPosition(comp.currentX, comp.currentY);

        //             if (comp.isDragging) {
        //                 const pointer = this.input.activePointer;
        //                 if (comp.lastPointerX !== null) {
        //                     const deltaX = pointer.x - comp.lastPointerX;
        //                     comp.velocityX = Phaser.Math.Linear(comp.velocityX, deltaX, 0.5);
        //                 }
        //                 comp.lastPointerX = pointer.x;

        //                 let targetRotation = 0;
        //                 if (Math.abs(comp.velocityX) > IDLE_THRESHOLD) {
        //                     targetRotation = Phaser.Math.Clamp(comp.velocityX * DAMP_FACTOR, -MAX_ROTATE, MAX_ROTATE);
        //                 }

        //                 comp.currentRotation = Phaser.Math.Linear(comp.currentRotation, targetRotation, ROTATION_EASE_SOFT);
        //                 card.setRotation(comp.currentRotation);

        //                 if (Math.abs(comp.velocityX) < IDLE_THRESHOLD && Math.abs(comp.currentRotation) < 0.01) {
        //                     comp.currentRotation = 0;
        //                     card.setRotation(0);
        //                 }
        //             } else {
        //                 comp.currentRotation = Phaser.Math.Linear(comp.currentRotation, comp.rotationTarget, ROTATION_EASE_HARD);
        //                 card.setRotation(comp.currentRotation);
        //             }
        //         }
        //     }
        // });
    }

    update() {
        CardPhysicsSystem(this)
    }
}
