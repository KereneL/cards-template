import { InputCardComponent } from "../../../components/input-component";
import { CARD_TWEENS } from "../../../config";
const { SHORT_DURATION, HOVERED_SCALE, IDLE_SCALE, EASE } = CARD_TWEENS;

export function gameObjectOver(pointer, gameObject, event) {
    const comp = InputCardComponent.getComp(gameObject);
    if (!comp || !comp.hoverable || this.isDragging) return;

    this.tweens.add({
        targets: gameObject,
        scale: HOVERED_SCALE,
        ease: EASE,
        duration: SHORT_DURATION,
    })
}

export function gameObjectOut(pointer, gameObject, event) {
    const comp = InputCardComponent.getComp(gameObject);
    if (!comp || !comp.hoverable || this.isDragging) return;

    this.tweens.add({
        targets: gameObject,
        scale: IDLE_SCALE,
        ease: EASE,
        duration: SHORT_DURATION,
    })
}