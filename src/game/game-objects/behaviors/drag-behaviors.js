import { InputCardComponent } from "../../components/input-card-component";
import { CARD_TWEENS } from "../../config";
const { SHORT_DURATION, DRAGGED_SCALE, DEFAULT_EASE } = CARD_TWEENS;

export function onDragStart(pointer, gameObject) {
    const comp = InputCardComponent.getComp(gameObject);
    if (!comp) return;

    comp.isDragging = true;
    comp.shouldUpdate = true;
    comp.lastPointerX = pointer.x;

    comp.originalZone = gameObject.parentZone;
    comp.originalZone?.handleDragStart?.(gameObject);

    gameObject.scene.children.bringToTop(comp.originalZone)
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
    const targetZone = dropZone.parentContainer;
    if (!targetZone) return;

    const comp = InputCardComponent.getComp(gameObject);
    const originZone = comp?.originalZone;

    const isSameZone = targetZone === originZone;
    const originAllowTakingCards = originZone.allowTakingCards;
    const targetAllowDroppingCards = targetZone.allowDroppingCards;

    if (isSameZone || !originAllowTakingCards || !targetAllowDroppingCards) {
        if (!isSameZone) {
            targetZone.removeCueCard();
            targetZone.hideCueCard();
        }
        gameObject.scene.input.emit('dragend', pointer, gameObject, false); // force revert
        return;
    }
    targetZone.transferCardFromZone(originZone, gameObject);
    targetZone.handleDrop(gameObject);
}
export function onDragEnd(pointer, gameObject, dropped, text) {
    const comp = InputCardComponent.getComp(gameObject);
    if (!comp) return;

    comp.isDragging = false;
    comp.rotationTarget = 0;

    const originalZone = comp.originalZone;

    if ((!dropped || !originalZone.allowTakingCards) && originalZone) {
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


        gameObject.parentContainer = originalZone;
        gameObject.parentZone = originalZone;

        //originalZone.layoutCards();

        comp.physicsEnabled = false;
        comp.shouldUpdate = false;
        comp.targetX = comp.currentX;
        comp.targetY = comp.currentY;

        gameObject.shakeForInvalidMove(function () {
            comp.targetX = gameObject.input.dragStartX;
            comp.targetY = gameObject.input.dragStartY;
            comp.physicsEnabled = true;
            comp.shouldUpdate = true;
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