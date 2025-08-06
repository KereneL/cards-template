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

        const {SHORTER_DURATION,SHORT_DURATION} = CARD_TWEENS
        const { width: gameWidth , height: gameHeight } = this.sys.game.canvas;
        //const spotlightA = this.lights.addLight(gameWidth/2, 0, gameWidth/2).setIntensity(10).setColor(0xFF0000)
        // const spotlightB = this.lights.addLight(gameWidth/2, gameHeight, gameWidth/2).setIntensity(10).setColor(0x0000FF)
        //this.lights.setAmbientColor(0x0ffffF)

        this.cameras.main.setBackgroundColor(COLORS.GREEN.TERTIARY);
        this.input.dragDistanceThreshold = GUI.DRAG_DISTANCE_THRESHOLD;
        this.activeCards = [];
        this.createDeck();
        this.deck.shuffle();
        const height = 162
        this.deckZone = new PileZone(this, 120, 425, 125, height, { name: 'Deck', defaultCueMode: 'deck' });
        this.enemy = new CardZone(this, 512, 125, 600, height, {name: 'Opponent Sortable', defaultCueMode: 'sortable'});
        // this.add.triangle(212,300,0,-75,0,+75,75,0, 0).setOrigin(0).setAlpha(0.25)
        // this.tableu = new CardZone(this, 512, 300, 600, height, {name: 'Shift Only', defaultCueMode: 'shift'} );
        // this.add.triangle(812,475,0,-75,0,+75,-75,0, 0).setOrigin(0).setAlpha(0.25)
        // this.tableu = new CardZone(this, 512, 475, 600, height, {name: 'Push Only', defaultCueMode: 'push'} );
        this.hand = new CardZone(this, 512, 650, 600, height, { name: 'Player Sortable', defaultCueMode: 'sortable' });

        this.add.existing(new Button({scene:this, text: "by Rank", idleColor:RED.SECONDARY._color, hoverColor:RED.TERTIARY._color, clickedColor:RED.PRIMARY._color, onClick: ()=>{console.log("Red")}})
        .setPosition(512+650/2+35,this.hand.getBounds().bottom - 16))
        this.add.existing(new Button({scene:this, text: "by Suit", idleColor:BLUE.SECONDARY._color, hoverColor:BLUE.TERTIARY._color, clickedColor:BLUE.PRIMARY._color, onClick: ()=>{console.log("Blue")}})
        .setPosition(512+650/2+35,this.hand.getBounds().bottom - 16 - 32 - 10))
        this.seq = [];

        this.dealSomeCards(40, this.deckZone);
        this.playActionSequence(SHORTER_DURATION)

        this.dealSomeCards(6, this.hand, true);        
        this.dealSomeCards(6, this.enemy, true);
        this.playActionSequence(SHORT_DURATION)

        this.inputManager = InputManager.getInstance(this)
    }
    playActionSequence(delay) {
        let indx = 0;
        while (this.seq.length > 0) {
            const fn = this.seq.shift()
            setTimeout(fn, (++indx)*delay)
        } 
    }
    createDeck() {
        const deckCardsArr = createRegularDeck(this);
        this.deck = new BaseDeck(this, deckCardsArr);
    }
    dealSomeCards(howManyCards, zone, revealCard) {
        const selected = [];
        const deckCards = this.deck.getChildren();

        for (let i = 0; i < howManyCards; i++) {
            if (deckCards.length > 0) {
                const card = deckCards.pop()
                if (revealCard) card.loadTexture()
                selected.push(card);
            } else {
                break;
            }
        }

        Phaser.Utils.Array.StableSort(selected, (a, b) => {
            const aComp = PlayingCardComponent.getComp(a);
            const bComp = PlayingCardComponent.getComp(b);
            return bComp.value.sequenceAs[0] - aComp.value.sequenceAs[0];
        });

        selected.forEach((card)=> {
            card.addComponent(InputComponent);
            this.seq.push(zone.seqAddCard(card))
        })

        this.activeCards.push(...selected);
        
    }
    update() {
        CardPhysicsSystem(this)
    }
}
