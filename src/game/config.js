
export const COLORS = {
  GREEN: {
    CARD: '#388f58',
    PRIMARY: '#2e7d4e',
    SECONDARY: '#388f58', //CARD
    TERTIARY: '#419e63',
    QUATERNARY: '#4aae70'
  },
  RED: {
    CARD: '#c23447',
    PRIMARY: '#b02c39',
    SECONDARY: '#c23447',//CARD
    TERTIARY: '#cf4053',
    QUATERNARY: '#db5566'
  },
  YELLOW: {
    CARD: '#fdad00',
    PRIMARY: '#eb9500',
    SECONDARY: '#fdad00',//CARD
    TERTIARY: '#fcbf3a',
    QUATERNARY: '#fed358',
  },
  BLUE: {
    CARD: '#204887',
    PRIMARY: '#204887',//CARD
    SECONDARY: '#275296',
    TERTIARY: '#2e5ea6',
    QUATERNARY: '#3972bb',
  },
  SKIN: '#ffccaa',
  DARK: {
    CARD: '#3b4052',
    LEVEL1: '#2b3b3d',
    LEVEL2: '#3b4052',
    LEVEL3: '#4b5061',
    LEVEL4: '#595e70'
  },
  LIGHT: {
    LEVEL1: '#c2c6d1',
    LEVEL2: '#e3e4e8',
    LEVEL3: '#f5f5f7',
    LEVEL4: '#ffffff'
  }
};
export const PHASER_COLORS = {
  GREEN: {
    PRIMARY: Phaser.Display.Color.HexStringToColor(COLORS.GREEN.PRIMARY),
    SECONDARY: Phaser.Display.Color.HexStringToColor(COLORS.GREEN.SECONDARY),
    TERTIARY: Phaser.Display.Color.HexStringToColor(COLORS.GREEN.TERTIARY)
  },
  RED: {
    PRIMARY: Phaser.Display.Color.HexStringToColor(COLORS.RED.PRIMARY),
    SECONDARY: Phaser.Display.Color.HexStringToColor(COLORS.RED.SECONDARY),
    TERTIARY: Phaser.Display.Color.HexStringToColor(COLORS.RED.TERTIARY)
  },
  YELLOW: {
    PRIMARY: Phaser.Display.Color.HexStringToColor(COLORS.YELLOW.PRIMARY),
    SECONDARY: Phaser.Display.Color.HexStringToColor(COLORS.YELLOW.SECONDARY),
    TERTIARY: Phaser.Display.Color.HexStringToColor(COLORS.YELLOW.TERTIARY)
  },
  BLUE: {
    PRIMARY: Phaser.Display.Color.HexStringToColor(COLORS.BLUE.PRIMARY),
    SECONDARY: Phaser.Display.Color.HexStringToColor(COLORS.BLUE.SECONDARY),
    TERTIARY: Phaser.Display.Color.HexStringToColor(COLORS.BLUE.TERTIARY)
  },
  SKIN: Phaser.Display.Color.HexStringToColor(COLORS.SKIN),
  DARK: {
    LEVEL1: Phaser.Display.Color.HexStringToColor(COLORS.DARK.LEVEL1),
    LEVEL2: Phaser.Display.Color.HexStringToColor(COLORS.DARK.LEVEL2),
    LEVEL3: Phaser.Display.Color.HexStringToColor(COLORS.DARK.LEVEL3),
    LEVEL4: Phaser.Display.Color.HexStringToColor(COLORS.DARK.LEVEL4)
  },
  LIGHT: {
    LEVEL1: Phaser.Display.Color.HexStringToColor(COLORS.LIGHT.LEVEL1),
    LEVEL2: Phaser.Display.Color.HexStringToColor(COLORS.LIGHT.LEVEL2),
    LEVEL3: Phaser.Display.Color.HexStringToColor(COLORS.LIGHT.LEVEL3),
    LEVEL4: Phaser.Display.Color.HexStringToColor(COLORS.LIGHT.LEVEL4)
  }
};
export const GAME_COLORS = {
  HEARTS: PHASER_COLORS.RED.SECONDARY,

  DIAMONDS: PHASER_COLORS.RED.SECONDARY,
  DIAMONDS_HC: PHASER_COLORS.BLUE.PRIMARY,

  SPADES: PHASER_COLORS.DARK.LEVEL1,

  CLUBS: PHASER_COLORS.DARK.LEVEL1,
  CLUBS_HC: PHASER_COLORS.GREEN.SECONDARY,
}
export const GUI = {
    DRAG_DISTANCE_THRESHOLD: 16,
    HIGH_CONTRAST: true,
    NAME_FONT_SIZE: 24,
    COUNTER_FONT_SIZE: 24,
    TEXT_GAP_H: 6,
    TEXT_GAP_V: 6,
}
export const ZONE_COLORS = {
    IDLE: PHASER_COLORS.DARK.LEVEL2,
  IDLE_ALPHA: 0.1,
  HOVER: PHASER_COLORS.DARK.LEVEL1,
  HOVER_ALPHA: 0.1,
  CLICKED: PHASER_COLORS.DARK.LEVEL3,
  CLICKED_ALPHA: 0.1,
  STROKE_WIDTH: 4,
  ROUNDED_RECT_RADIUS: 8,
}
export const CARD_TWEENS = {
    SHORTER_DURATION: 50,
    SHORT_DURATION: 100,
    LONG_DURATION: 175,
    LONGER_DURATION: 275,

    STANDARD_SCALE: 1,
    HOVERED_SCALE: 1.025,
    CLICKED_SCALE: 0.975,
    DRAGGED_SCALE: 1.075,

    VELOCITY_LERP: 0.6,
    LINEAR_LERP: 0.45,

    MAX_ROTATE: Math.PI / 2,
    CUE_CARD_TILT: 5,
    MAX_TILT: 25,
    ROTATION_EASE_SOFT: 0.25,
    ROTATION_EASE_HARD: 0.45,

    DAMP_FACTOR: 0.04,
    IDLE_THRESHOLD: 5,
    DEFAULT_EASE: 'Back.easeOut'
}
export const CARD_RECT_STYLE = {
    CARD_BASE_WIDTH: 39,
    CARD_BASE_HEIGHT: 55,
    RADIUS: 1,
    WIDTH_SCALE: 2,
    HEIGHT_SCALE: 2,
    CARD_STROKE_WIDTH: 3,
    CUE_ALPHA: 0.5,
    TEXT_PADDING_H: 1,
    TEXT_PADDING_V: 4,
}
export const CARD_TEXT_STYLE = {
    fontFamily: 'dicier',
    fontSize: 32,
    padding: 1,
    align: 'center',
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
        texturePhrase: 'a',
        indexInSpritesheet: 0,
        textureKeyName: 'ACE',
        rankAs: 14,
        sequenceAs: [14, 1],
        isRoyal: false,
        isNumber: true,
    },
    TWO: {
        label: '2',
        textualName: 'Two',
        texturePhrase: '2',
        indexInSpritesheet: 1,
        textureKeyName: 'TWO',
        rankAs: 2,
        sequenceAs: [2],
        isRoyal: false,
        isNumber: true,
    },
    THREE: {
        label: '3',
        textualName: 'Three',
        texturePhrase: '3',
        indexInSpritesheet: 2,
        textureKeyName: 'THREE',
        rankAs: 3,
        sequenceAs: [3],
        isRoyal: false,
        isNumber: true,
    },
    FOUR: {
        label: '4',
        textualName: 'Four',
        texturePhrase: '4',
        indexInSpritesheet: 3,
        textureKeyName: 'FOUR',
        rankAs: 4,
        sequenceAs: [4],
        isRoyal: false,
        isNumber: true,
    },
    FIVE: {
        label: '5',
        textualName: 'Five',
        texturePhrase: '5',
        indexInSpritesheet: 4,
        textureKeyName: 'FIVE',
        rankAs: 5,
        sequenceAs: [5],
        isRoyal: false,
        isNumber: true,
    },
    SIX: {
        label: '6',
        textualName: 'Six',
        texturePhrase: '6',
        indexInSpritesheet: 5,
        textureKeyName: 'SIX',
        rankAs: 6,
        sequenceAs: [6],
        isRoyal: false,
        isNumber: true,
    },
    SEVEN: {
        label: '7',
        textualName: 'Seven',
        texturePhrase: '7',
        indexInSpritesheet: 6,
        textureKeyName: 'SEVEN',
        rankAs: 7,
        sequenceAs: [7],
        isRoyal: false,
        isNumber: true,
    },
    EIGHT: {
        label: '8',
        textualName: 'Eight',
        texturePhrase: '8',
        indexInSpritesheet: 7,
        textureKeyName: 'EIGHT',
        rankAs: 8,
        sequenceAs: [8],
        isRoyal: false,
        isNumber: true,
    },
    NINE: {
        label: '9',
        textualName: 'Nine',
        texturePhrase: '9',
        indexInSpritesheet: 8,
        textureKeyName: 'NINE',
        rankAs: 9,
        sequenceAs: [9],
        isRoyal: false,
        isNumber: true,
    },
    TEN: {
        label: '10',
        textualName: 'Ten',
        texturePhrase: '10',
        indexInSpritesheet: 9,
        textureKeyName: 'TEN',
        rankAs: 10,
        sequenceAs: [10],
        isRoyal: false,
        isNumber: true,
    },
    JACK: {
        label: 'J',
        textualName: 'Jack',
        texturePhrase: 'j',
        indexInSpritesheet: 10,
        textureKeyName: 'JACK',
        rankAs: 10,
        sequenceAs: [11],
        isRoyal: true,
        isNumber: false,
    },
    QUEEN: {
        label: 'Q',
        textualName: 'Queen',
        texturePhrase: 'q',
        indexInSpritesheet: 11,
        textureKeyName: 'QUEEN',
        rankAs: 10,
        sequenceAs: [12],
        isRoyal: true,
        isNumber: false,
    },
    KING: {
        label: 'K',
        textualName: 'King',
        texturePhrase: 'k',
        indexInSpritesheet: 12,
        textureKeyName: 'KING',
        rankAs: 10,
        sequenceAs: [13],
        isRoyal: true,
        isNumber: false,
    }
};
export const CARD_SUITES = {
    HEARTS: {
        label: '♥',
        textualName: 'Hearts',
        texturePhrase: 'h',
        spritesheetRow: 0,
        gameColor: COLORS.RED.CARD,
        suitColorType: SUIT_COLOR_TYPES.RED,
    },
    DIAMONDS: {
        label: '♦',
        textualName: 'Diamonds',
        texturePhrase: 'd',
        spritesheetRow: (GUI.HIGH_CONTRAST)?4:1,
        textureKeyName: 'DIAMONDS',
        gameColor: (GUI.HIGH_CONTRAST)?COLORS.BLUE.CARD:COLORS.RED.CARD,
        suitColorType: SUIT_COLOR_TYPES.RED,
    },
    SPADES: {
        label: '♠',
        textualName: 'Spades',
        texturePhrase: 's',
        spritesheetRow: 3,
        textureKeyName: 'SPADES',
        gameColor: COLORS.DARK.CARD,
        suitColorType: SUIT_COLOR_TYPES.BLACK,
    },
    CLUBS: {
        label: '♣',
        textualName: 'Clubs',
        texturePhrase: 'c',
        spritesheetRow: (GUI.HIGH_CONTRAST)?5:2,
        textureKeyName: 'CLUBS',
        gameColor: (GUI.HIGH_CONTRAST)?COLORS.GREEN.CARD:COLORS.DARK.CARD,
        suitColorType: SUIT_COLOR_TYPES.BLACK,
    },
}