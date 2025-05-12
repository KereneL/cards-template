import { BaseComponent } from './base-component';

export class PlayingCardComponent extends BaseComponent {
  constructor(gameObject, suit, value) {
    super(gameObject);
    this.suit = suit;
    this.value = value;
  }

  get rank() {
    return this.value.rankAs;
  }

  get isRoyal() {
    return this.value.isRoyal;
  }

  get suitLabel() {
    return this.suit.label;
  }

  get valueLabel() {
    return this.value.label;
  }

  get name() {
    return `${this.value.label} of ${this.suit.label}`;
  }

  get label() {
    return `${this.value.label}\n${this.suit.label}`;
  }

  get colorType() {
    return this.suit.suitColorType;
  }
}
