import { CARD_TWEENS } from "../../config";
import { InputComponent } from "../../components/input-component";

const { SHORT_DURATION, HOVERED_SCALE, STANDARD_SCALE, DEFAULT_EASE } = CARD_TWEENS;

export function gameObjectDown(pointer, gameObject, event) {
    const comp = InputComponent.getComp(gameObject);
    if (!comp || !comp.clickable || this.isDragging) return;
    gameObject?.onPointerDown?.(pointer)
}

export function gameObjectUp(pointer, gameObject, event) {
    const comp = InputComponent.getComp(gameObject);
    if (!comp || !comp.clickable || this.isDragging) return;
    gameObject?.onPointerUp?.(pointer)
}
