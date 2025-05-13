import { InputCardComponent } from "../../../components/input-component";
import { CARD_TWEENS } from "../../../config";
const { SHORT_DURATION, DRAGGED_SCALE, EASE } = CARD_TWEENS;

export function onDragStart(pointer, gameObject) {
    const comp = InputCardComponent.getComp(gameObject);
    if (!comp) return;

    this.isDragging = true;
    comp.isDragging = true;
    comp.shouldUpdate = true;
    comp.lastPointerX = pointer.x;

    comp.originalZone = gameObject.parentZone;
    comp.originalZone?.handleDragStart?.(gameObject);

    this.children.bringToTop(comp.originalZone)
    gameObject.setDepth(999)
    comp.originalZone.sortChildren('depth')
    gameObject.scaleForDrag()
}
export function onDrag(pointer, gameObject, dragX, dragY) {
    const comp = InputCardComponent.getComp(gameObject);
    if (!comp) return;

    comp.targetX = dragX;
    comp.targetY = dragY;

}
export function onDragEnter(pointer, gameObject, dropZone) {
    dropZone.parentContainer?.handleDragEnter?.(gameObject);
}
export function onDragLeave(pointer, gameObject, dropZone) {
    dropZone.parentContainer?.handleDragLeave?.(gameObject);
}
export function onDragOver(pointer, gameObject, dropZone) {
    dropZone.parentContainer?.handleDragOver?.(gameObject);
}
export function onDrop(pointer, gameObject, dropZone) {
    const container = dropZone.parentContainer;
    if (!container) return;

    const comp = InputCardComponent.getComp(gameObject);
    const origin = comp?.originalZone;

    const isSameZone = container === origin;

    if (isSameZone) {
        this.input.emit('dragend', pointer, gameObject, false); // force revert
        return;
    }

    container.transferCardFromZone(origin, gameObject);
    container.handleDrop(gameObject);
}
export function onDragEnd(pointer, gameObject, dropped) {
    const comp = InputCardComponent.getComp(gameObject);
    if (!comp) return;

    this.isDragging = false;
    comp.isDragging = false;
    comp.rotationTarget = 0;

    const originalZone = comp.originalZone;

    if (!dropped && originalZone) {

        // ❌ Remove cueCard if it's still in the array
        const cueIdx = originalZone.cards.indexOf(originalZone.cueCard);
        if (cueIdx !== -1) {
            originalZone.cards.splice(cueIdx, 1);
        }

        const index = originalZone.cards.indexOf(gameObject);
        if (index === -1) {
            const restoreIndex = originalZone.cueIndex ?? originalZone.cards.length;
            originalZone.cards.splice(restoreIndex, 0, gameObject);
            originalZone.add(gameObject);
        }

        gameObject.parentZone = originalZone;
        gameObject.parentContainer = originalZone;

        originalZone.layoutCards();

        comp.physicsEnabled = false;
        comp.targetX = comp.currentX;
        comp.targetY = comp.currentY;

        const originalX = comp.currentX;
        gameObject.shakeForInvalidMove(function () {
            comp.targetX = gameObject.input.dragStartX;
            comp.targetY = gameObject.input.dragStartY;
            comp.shouldUpdate = true;
            comp.physicsEnabled = true;
            originalZone.hideCueCard?.();
            originalZone.originalCard = null;
            originalZone.cueIndex = null;
            originalZone.originalCueIndex = null;
        })
    } else {
        originalZone?.hideCueCard?.();
        originalZone.originalCard = null;
        originalZone.cueIndex = null;
    }
    gameObject.scaleAfterDrag()
}