
export const GAME_COLORS = {
    SPADES: {
        phaser: 0x000000,
        hex: '#000000'
    },
    HEARTS: {
        phaser: 0xFF0000,
        hex: '#ff0000'
    },
    DIAMONDS: {
        phaser: 0xFF0000,
        hex: '#ff0000'
    },
    CLUBS: {
        phaser: 0x000000,
        hex: '#000000'
    },
}
export const CARD_TWEENS = {
    SHORTER_DURATION: 60,
    SHORT_DURATION: 100,
    LONG_DURATION: 160,
    LONGER_DURATION: 260,
    IDLE_SCALE: 1,
    HOVERED_SCALE: 1.125,
    DRAGGED_SCALE: 1.075,
    MAX_ROTATE: Math.PI / 3,
    ROTATION_EASE_SOFT: 0.15,
    ROTATION_EASE_HARD: 0.4,
    DAMP_FACTOR: 0.04,
    IDLE_THRESHOLD: 5,
    EASE: 'Back.easeOut'
}
export const CARD_RECT_STYLE = {
    CARD_BASE_SIZE: 24,
    CARD_STROKE_WIDTH: 2,
    WIDTH_SCALE: 2.5,
    HEIGHT_SCALE: 3.5,
}
export const CARD_TEXT_STYLE = {
    fontFamily: 'dicier',
    //fontFamily: 'Lucida Console',
    //fontStyle: 'bold',
    align: 'left',
}
export const SUIT_COLOR_TYPES = {
    BLACK: 'BLACK',
    RED: 'RED',
}
export const PIP_TYPES = {
    ROYAL: 'ROYAL',
    NUMERAL: 'NUMERAL',
}
export const CARD_VALUES = {
    ACE: {
        label: 'A',
        textualName: 'Ace',
        textureKeyName: 'ACE',
        rankAs: 14,
        sequenceAs: [14, 1],
        isRoyal: false,
        isNumber: true,
    },
    TWO: {
        label: '2',
        textualName: 'Two',
        textureKeyName: 'TWO',
        rankAs: 2,
        sequenceAs: [2],
        isRoyal: false,
        isNumber: true,
    },
    THREE: {
        label: '3',
        textualName: 'Three',
        textureKeyName: 'THREE',
        rankAs: 3,
        sequenceAs: [3],
        isRoyal: false,
        isNumber: true,
    },
    FOUR: {
        label: '4',
        textualName: 'Four',
        textureKeyName: 'FOUR',
        rankAs: 4,
        sequenceAs: [4],
        isRoyal: false,
        isNumber: true,
    },
    FIVE: {
        label: '5',
        textualName: 'Five',
        textureKeyName: 'FIVE',
        rankAs: 5,
        sequenceAs: [5],
        isRoyal: false,
        isNumber: true,
    },
    SIX: {
        label: '6',
        textualName: 'Six',
        textureKeyName: 'SIX',
        rankAs: 6,
        sequenceAs: [6],
        isRoyal: false,
        isNumber: true,
    },
    SEVEN: {
        label: '7',
        textualName: 'Seven',
        textureKeyName: 'SEVEN',
        rankAs: 7,
        sequenceAs: [7],
        isRoyal: false,
        isNumber: true,
    },
    EIGHT: {
        label: '8',
        textualName: 'Eight',
        textureKeyName: 'EIGHT',
        rankAs: 8,
        sequenceAs: [8],
        isRoyal: false,
        isNumber: true,
    },
    NINE: {
        label: '9',
        textualName: 'Nine',
        textureKeyName: 'NINE',
        rankAs: 9,
        sequenceAs: [9],
        isRoyal: false,
        isNumber: true,
    },
    TEN: {
        label: '10',
        textualName: 'Ten',
        textureKeyName: 'TEN',
        rankAs: 10,
        sequenceAs: [10],
        isRoyal: false,
        isNumber: true,
    },
    JACK: {
        label: 'J',
        textualName: 'Jack',
        textureKeyName: 'JACK',
        rankAs: 10,
        sequenceAs: [11],
        isRoyal: true,
        isNumber: false,
    },
    QUEEN: {
        label: 'Q',
        textualName: 'Queen',
        textureKeyName: 'QUEEN',
        rankAs: 10,
        sequenceAs: [12],
        isRoyal: true,
        isNumber: false,
    },
    KING: {
        label: 'K',
        textualName: 'King',
        textureKeyName: 'KING',
        rankAs: 10,
        sequenceAs: [13],
        isRoyal: true,
        isNumber: false,
    }
};
export const CARD_SUITES = {
    SPADES: {
        label: '♠',
        textualName: 'Spades',
        textureKeyName: 'SPADES',
        gameColor: GAME_COLORS.SPADES,
        suitColorType: SUIT_COLOR_TYPES.BLACK,
    },
    HEARTS: {
        label: '♥',
        textualName: 'Hearts',
        textureKeyName: 'HEARTS',
        gameColor: GAME_COLORS.HEARTS,
        suitColorType: SUIT_COLOR_TYPES.RED,
    },
    DIAMONDS: {
        label: '♦',
        textualName: 'Diamonds',
        textureKeyName: 'DIAMONDS',
        gameColor: GAME_COLORS.DIAMONDS,
        suitColorType: SUIT_COLOR_TYPES.RED,
    },
    CLUBS: {
        label: '♣',
        textualName: 'Clubs',
        textureKeyName: 'CLUBS',
        gameColor: GAME_COLORS.CLUBS,
        suitColorType: SUIT_COLOR_TYPES.BLACK,
    }
}