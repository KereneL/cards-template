import Phaser from 'phaser';
import { CARD_SUITES, CARD_VALUES } from '../config'
import { PlayingCard } from './cards/playing-card';

export function createRegularDeck(scene) {
    const deckArray = [];
    for (const suitKey in CARD_SUITES) {
        for (const valueKey in CARD_VALUES) {
            const card = new PlayingCard({
                scene,
                cardSuit: CARD_SUITES[suitKey],
                cardValue: CARD_VALUES[valueKey]
            });
            deckArray.push(card);
        }
    }
    return deckArray;
}

export class BaseDeck extends Phaser.GameObjects.Group {
    constructor(scene, deckArray) {
        super(scene)
        this.addMultiple(deckArray,false)
    }
}

