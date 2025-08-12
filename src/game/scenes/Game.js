import Phaser from 'phaser';
import { createRegularDeck, BaseDeck } from '../game-objects/deck/base-deck';
import { PlayingCardComponent } from '../components/playing-card-component';
import { InputManager } from '../game-objects/behaviors/input-manager';
import { InputComponent } from '../components/input-component';
import { CardZone } from '../game-objects/zones/card-zone';
import { CardPhysicsSystem } from '../utils'
import { PHASER_COLORS, COLORS, GUI, CARD_TWEENS } from '../config';
import { PileZone } from '../game-objects/zones/pile-zone';
import { Button } from '../game-objects/gui/button';

const { RED, BLUE } = PHASER_COLORS;
export class Game extends Phaser.Scene {
    constructor() {
        super('Game');

    }
    create() {
        this.lights.enable();
        this.lights.setAmbientColor(0xFFFFFF);

        const { SHORT_DURATION, SHORTER_DURATION } = CARD_TWEENS
        const { width: gameWidth, height: gameHeight } = this.sys.game.canvas;
        // const spotlightA = this.lights.addLight(0, 0, gameWidth).setIntensity(10).setColor(0xFF0000)
        // const spotlightB = this.lights.addLight(gameWidth, gameHeight, gameWidth).setIntensity(10).setColor(0xFFFF00)
        // const spotlightC = this.lights.addLight(gameWidth, 0, gameWidth).setIntensity(10).setColor(0x00FF00)
        // const spotlightD = this.lights.addLight(0, gameHeight, gameWidth).setIntensity(10).setColor(0x0000FF)

        this.cameras.main.setBackgroundColor(COLORS.GREEN.TERTIARY);
        this.input.dragDistanceThreshold = GUI.DRAG_DISTANCE_THRESHOLD;
        this.activeCards = [];
        this.createDeck();
        this.deck.shuffle();
        const height = 162
        console.log(this.deck)
        this.deckZone = new PileZone(this, 120, 650, 125, height, { name: 'Deck', defaultCueMode: 'deck', maxAmount: this.deck.getLength() });
        this.hand = new CardZone(this, 536, 650, 600, height, { name: 'Hand One', defaultCueMode: 'sortable' });
        this.enemy = new CardZone(this, 536, 125, 600, height, { name: 'Hand Two', defaultCueMode: 'sortable' });
        // this.add.triangle(212,300,0,-75,0,+75,75,0, 0).setOrigin(0).setAlpha(0.25)
        // this.tableu = new CardZone(this, 512, 300, 600, height, {name: 'Shift Only', defaultCueMode: 'shift'} );
        this.add.triangle(812, 400, 0, -75, 0, +75, -75, 0, 0).setOrigin(0).setAlpha(0.25)
        this.tableu = new CardZone(this, 512, 400, 600, height, { name: 'Push Only', defaultCueMode: 'push' });

        const handBounds = this.hand.getBounds()
        this.add.existing(new Button({ scene: this, text: "Sort by Rank", idleColor: RED.SECONDARY._color, hoverColor: RED.TERTIARY._color, clickedColor: RED.PRIMARY._color, onClick: () => { this.sortCardZoneByRank(this.hand.cards); this.hand.layoutCards() } })
            .setPosition(handBounds.right + 60, handBounds.bottom - 16))
        this.add.existing(new Button({ scene: this, text: "Sort by Suit", idleColor: BLUE.SECONDARY._color, hoverColor: BLUE.TERTIARY._color, clickedColor: BLUE.PRIMARY._color, onClick: () => { this.sortCardZoneBySuit(this.hand.cards); this.hand.layoutCards() } })

            .setPosition(handBounds.right + 60, handBounds.bottom - 16 - 32 - 10))

        this.inputManager = InputManager.getInstance(this)

        this.seq = [];

        this.seedDeckPile();
        this.playActionSequence(0)

        const flipUpCallback = (cards) => {
            cards.forEach((card, indx) => {
                this.seq.push(card.flipToFaceUp)
            })
        }
        this.dealSomeCards(20, this.hand, true, flipUpCallback);
        //this.dealSomeCards(6, this.enemy, true, flipUpCallback);
        this.playActionSequence(SHORTER_DURATION);

    }
    playActionSequence(delay) {
        let indx = 0;
        while (this.seq.length > 0) {
            const fn = this.seq.shift()
            setTimeout(fn, (++indx) * delay)
        }
    }
    createDeck() {
        const deckCardsArr = createRegularDeck(this);
        this.deck = new BaseDeck(this, deckCardsArr);
    }

    seedDeckPile() {
        const deckCards = this.deck.getChildren();
        while (deckCards.length > 0) {
            const card = deckCards.pop()
            card.addComponent(InputComponent, {
                isHoverable: true,
                isDraggable: true,
                isClickable: true,
                isDropZone: false,
                isEnabled: false,
            });
            this.deckZone.addCard(card);
            this.activeCards.push(card);
        }
    }

    dealSomeCards(howManyCards, zone, revealCards, callback) {
        const selected = [];
        const deckCards = this.deckZone.cards
        for (let i = 0; i < howManyCards; i++) {
            if (deckCards.length > 0) {
                const card = deckCards.pop()
                selected.push(card);
            } else {
                break;
            }
        }
        selected.forEach((card) => {
            this.seq.push(
                () => {
                    const comp = InputComponent.getComp(card)
                    comp.isEnabled = true;
                    zone.transferCardFromZone(this.deckZone, card);
                    zone.handleDrop(card);
                }
            )
        })
        if (revealCards) {
            selected.forEach((card) => {
                this.seq.push(() => { card.flipToFaceUp() })
            })
        }
    }

    sortCardZoneBySuit(cardArr) {
        Phaser.Utils.Array.StableSort(cardArr, (a, b) => {
            const aComp = PlayingCardComponent.getComp(a);
            const bComp = PlayingCardComponent.getComp(b);
            return ((bComp.suit.sequenceAs * 100 + bComp.value.sequenceAs[0]) - (aComp.suit.sequenceAs * 100 + aComp.value.sequenceAs[0]));
        });
    }
    sortCardZoneByRank(cardArr) {
        Phaser.Utils.Array.StableSort(cardArr, (a, b) => {
            const aComp = PlayingCardComponent.getComp(a);
            const bComp = PlayingCardComponent.getComp(b);
            return ((bComp.value.sequenceAs[0] * 100 + bComp.suit.sequenceAs) - (aComp.value.sequenceAs[0] * 100 + aComp.suit.sequenceAs));
        });
    }

    update() {
        CardPhysicsSystem(this)
    }
}
