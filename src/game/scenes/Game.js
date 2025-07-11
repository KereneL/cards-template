import Phaser from 'phaser';
import { createRegularDeck, BaseDeck } from '../game-objects/deck/base-deck';
import { PlayingCardComponent } from '../components/playing-card-component';
import { InputCardComponent } from '../components/input-component';
import { CardZone } from '../game-objects/zones/card-zone';
import { CardPhysicsSystem } from '../utils'
import { gameObjectOver, gameObjectOut } from '../game-objects/zones/behaviors/hover-behaviors';
import { onDragStart, onDrag, onDragEnter, onDragLeave, onDragOver, onDrop, onDragEnd } from '../game-objects/zones/behaviors/drag-behaviors';
import { COLORS } from '../config';
export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        
    }
    create() {
        this.cameras.main.setBackgroundColor(COLORS.GREEN.TERTIARY);
        this.input.dragDistanceThreshold = 2;
        this.isDragging = false;
        this.activeCards = [];
        this.createDeck();
        this.deck.shuffle();
        const height = 162
        this.enemy = new CardZone(this, 512, 125, 600, height, {name: 'Opponent Sortable', defaultCueMode: 'sortable'});
        this.add.triangle(212,300,0,-75,0,+75,75,0, 0).setOrigin(0).setAlpha(0.25)
        this.tableu = new CardZone(this, 512, 300, 600, height, {name: 'Shift Only', defaultCueMode: 'shift'} );
        this.add.triangle(812,475,0,-75,0,+75,-75,0, 0).setOrigin(0).setAlpha(0.25)
        this.tableu = new CardZone(this, 512, 475, 600, height, {name: 'Push Only', defaultCueMode: 'push'} );
        this.hand = new CardZone(this, 512, 650, 600, height, { name: 'Player Sortable', defaultCueMode: 'sortable' });

        this.seq = [];
        this.dealSomeCards(10, this.hand);
        this.dealSomeCards(10, this.enemy);

        this.seq.forEach((val, indx) => {
            setTimeout(val, (indx+1)*75)
        })

        this.applyListeners();
    }
    createDeck() {
        const deckCardsArr = createRegularDeck(this);
        this.deck = new BaseDeck(this, deckCardsArr);
    }
    dealSomeCards(howManyCards, zone) {
        const selected = [];
        const deckCards = this.deck.getChildren();

        for (let i = 0; i < howManyCards; i++) {
            if (deckCards.length > 0) {
                const card = deckCards.pop()
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
            card.addComponent(InputCardComponent);
            this.seq.push(zone.seqAddCard(card))
        })

        this.activeCards.push(...selected);
        
    }
    applyListeners() {
        this.input.on('gameobjectover', gameObjectOver, this);
        this.input.on('gameobjectout', gameObjectOut, this);
        this.input.on('dragstart', onDragStart, this);
        this.input.on('drag', onDrag, this);
        this.input.on('dragenter', onDragEnter, this);
        this.input.on('dragleave', onDragLeave, this);
        this.input.on('dragover', onDragOver, this);
        this.input.on('drop', onDrop, this);
        this.input.on('dragend', onDragEnd, this);
    }
    update() {
        CardPhysicsSystem(this)
    }
}
