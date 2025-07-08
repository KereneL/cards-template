import { InputCardComponent } from "../../../components/input-component";
import { CARD_TWEENS } from "../../../config";
const { SHORT_DURATION, HOVERED_SCALE, STANDARD_SCALE, DEFAULT_EASE } = CARD_TWEENS;

export function gameObjectOver(pointer, gameObject, event) {
    const comp = InputCardComponent.getComp(gameObject);
    if (!comp || !comp.hoverable || this.isDragging) return;

    this.tweens.add({
        targets: gameObject,
        scale: HOVERED_SCALE,
        ease: DEFAULT_EASE,
        duration: SHORT_DURATION,
    })
}

export function gameObjectOut(pointer, gameObject, event) {
    const comp = InputCardComponent.getComp(gameObject);
    if (!comp || !comp.hoverable || this.isDragging) return;

    this.tweens.add({
        targets: gameObject,
        scale: STANDARD_SCALE,
        ease: DEFAULT_EASE,
        duration: SHORT_DURATION,
    })
}