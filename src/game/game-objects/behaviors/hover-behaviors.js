import { InputComponent } from "../../components/input-component";
import { CARD_TWEENS } from "../../config";
const { SHORT_DURATION, HOVERED_SCALE, STANDARD_SCALE, DEFAULT_EASE } = CARD_TWEENS;

export function gameObjectOver(pointer, gameObject, event) {
    const comp = InputComponent.getComp(gameObject);
    if (!comp || !comp.hoverable || this.isDragging) return;

    gameObject?.onPointerOver?.(pointer)
}

export function gameObjectMove(pointer, gameObject, event) {
    const comp = InputComponent.getComp(gameObject);
    if (!comp || !comp.hoverable || this.isDragging) return;

    gameObject?.onPointerMove?.(pointer)
}
export function gameObjectOut(pointer, gameObject, event) {
    const comp = InputComponent.getComp(gameObject);
    if (!comp || !comp.hoverable || this.isDragging) return;

    gameObject?.onPointerOut?.(pointer)
}