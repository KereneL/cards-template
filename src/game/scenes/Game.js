import Phaser from 'phaser';
import { CARD_SUITES, CARD_VALUES, CARD_TWEENS } from '../config';
import { createRegularDeck, BaseDeck } from '../game-objects/deck/base-deck';
import { PlayingCardComponent } from '../components/playing-card-component';
import { InputCardComponent } from '../components/input-component';
import { BaseZone } from '../game-objects/zones/base-zone';
import { CardPhysicsSystem } from '../utils'
export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background').setAlpha(0.25);
        this.input.dragDistanceThreshold = 2;
        this.isDragging = false;
        this.createDeck();
        this.deck.shuffle();

        this.enemy = new BaseZone(this, 512, 250, 600, 150, (card, zone) => {
            const cardName = PlayingCardComponent.getComp(card).name
            console.log(`Dropped ${cardName || 'card'} on enemy hand`);
        });

        this.tableu = new BaseZone(this, 512, 425, 600, 150, (card, zone) => {
            const cardName = PlayingCardComponent.getComp(card).name
            console.log(`Dropped ${cardName || 'card'} on tableu`);
        });

        this.hand = new BaseZone(this, 512, 600, 600, 150, (card, zone) => {
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
            if (!comp || !comp.hoverable || this.isDragging) return;

            this.tweens.add({
                targets: gameObject,
                scale: HOVERED_SCALE,
                ease: EASE,
                duration: SHORT_DURATION,
            })
        }, this);
        this.input.on('gameobjectout', function (pointer, gameObject, event) {
            const comp = InputCardComponent.getComp(gameObject);
            if (!comp || !comp.hoverable || this.isDragging) return;

            this.tweens.add({
                targets: gameObject,
                scale: IDLE_SCALE,
                ease: EASE,
                duration: SHORT_DURATION,
            })
        }, this);
        this.input.on('dragstart', function (pointer, gameObject) {
            const comp = InputCardComponent.getComp(gameObject);
            if (!comp) return;

            this.isDragging = true;
            comp.isDragging = true;
            comp.shouldUpdate = true;
            comp.lastPointerX = pointer.x;

            comp.originalZone = gameObject.parentZone;
            comp.originalZone?.handleDragStart?.(gameObject);
            this.children.bringToTop(comp.originalZone)
            gameObject.setDepth(999)
            comp.originalZone.sortChildren('depth')

            this.tweens.add({
                targets: gameObject,
                scale: DRAGGED_SCALE,
                ease: EASE,
                duration: SHORT_DURATION,
            });

            if (gameObject.cardShadow) {
                this.tweens.add({
                    targets: gameObject.cardShadow,
                    alpha: 0.35,
                    scale: DRAGGED_SCALE,
                    ease: EASE,
                    duration: SHORT_DURATION,
                });
            }
        }, this);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            const comp = InputCardComponent.getComp(gameObject);
            if (!comp) return;

            comp.targetX = dragX;
            comp.targetY = dragY;

        }, this);
        this.input.on('dragenter', function (pointer, gameObject, dropZone) {
            dropZone.parentContainer?.handleDragEnter?.(gameObject);
        }, this);
        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            dropZone.parentContainer?.handleDragLeave?.(gameObject);
        }, this);
        this.input.on('dragover', function (pointer, gameObject, dropZone) {
            dropZone.parentContainer?.handleDragOver?.(gameObject);
        }, this);
        this.input.on('drop', function (pointer, gameObject, dropZone) {
            const container = dropZone.parentContainer;
            if (!container) return;

            const comp = InputCardComponent.getComp(gameObject);
            const origin = comp?.originalZone;

            const isSameZone = container === origin;
            const isSorted = container.playerSortable;

            if (!isSorted && isSameZone) {
                // Cancel drop, treat as invalid
                this.input.emit('dragend', pointer, gameObject, false); // force revert
                return;
            }

            container.transferCardFromZone(origin, gameObject);
            container.handleDrop(gameObject);
        }, this);
        this.input.on('dragend', function (pointer, gameObject, dropped) {

            const comp = InputCardComponent.getComp(gameObject);
            if (!comp) return;

            this.isDragging = false;
            comp.isDragging = false;
            comp.rotationTarget = 0;

            const originZone = comp.originalZone;

            if (!dropped && originZone) {
                // Cancel the move: restore to origin zone

                const index = originZone.cards.indexOf(gameObject);
                if (index === -1) {
                    // Re-insert card at previous cue index
                    const restoreIndex = originZone._cueIndex ?? originZone.cards.length;
                    originZone.cards.splice(restoreIndex, 0, gameObject);
                    originZone.add(gameObject);
                }

                gameObject.parentZone = originZone;
                gameObject.parentContainer = originZone;

                originZone.layoutCards();

                // Shake animation
                comp.physicsEnabled = false;
                comp.targetX = comp.currentX;
                comp.targetY = comp.currentY;

                const originalX = comp.currentX;
                this.tweens.add({
                    targets: gameObject,
                    x: originalX + 10,
                    duration: 50,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: 1,
                    completeDelay: SHORT_DURATION,
                    onComplete: () => {
                        comp.targetX = gameObject.input.dragStartX;
                        comp.targetY = gameObject.input.dragStartY;
                        comp.shouldUpdate = true;
                        comp.physicsEnabled = true;
                        originZone.hideCueCard?.();
                        originZone._originCard = null;
                        originZone._cueIndex = null;
                    }
                });

            } else {
                // Valid drop: cleanup cue from origin
                originZone?.hideCueCard?.();
                originZone._cueIndex = null;
            }

            // Restore card visuals
            if (gameObject.cardShadow) {
                this.tweens.add({
                    targets: gameObject.cardShadow,
                    alpha: 0,
                    scale: 1,
                    ease: EASE,
                    duration: CARD_TWEENS.SHORT_DURATION,
                });
            }

            this.tweens.add({
                targets: gameObject,
                scale: CARD_TWEENS.IDLE_SCALE,
                ease: CARD_TWEENS.EASE,
                duration: CARD_TWEENS.SHORT_DURATION,
            });
        }, this);
    }
    update() {
        CardPhysicsSystem(this)
    }
}
