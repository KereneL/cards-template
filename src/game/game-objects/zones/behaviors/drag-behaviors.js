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

    this.tweens.add({
        targets: gameObject,
        scale: DRAGGED_SCALE,
        ease: EASE,
        duration: SHORT_DURATION,
    });

    if (gameObject.cardShadow) {
        this.tweens.add({
            targets: gameObject.cardShadow,
            alpha: 0.35,
            scale: DRAGGED_SCALE,
            ease: EASE,
            duration: SHORT_DURATION,
        });
    }
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
    const isSorted = container.playerSortable;

    if (!isSorted && isSameZone) {
        // Cancel drop, treat as invalid
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

    const originZone = comp.originalZone;

    if (!dropped && originZone) {
        // Cancel the move: restore to origin zone

        const index = originZone.cards.indexOf(gameObject);
        if (index === -1) {
            // Re-insert card at previous cue index
            const restoreIndex = originZone._cueIndex ?? originZone.cards.length;
            originZone.cards.splice(restoreIndex, 0, gameObject);
            originZone.add(gameObject);
        }

        gameObject.parentZone = originZone;
        gameObject.parentContainer = originZone;

        originZone.layoutCards();

        // Shake animation
        comp.physicsEnabled = false;
        comp.targetX = comp.currentX;
        comp.targetY = comp.currentY;

        const originalX = comp.currentX;
        this.tweens.add({
            targets: gameObject,
            x: originalX + 10,
            duration: 50,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: 1,
            completeDelay: SHORT_DURATION,
            onComplete: () => {
                comp.targetX = gameObject.input.dragStartX;
                comp.targetY = gameObject.input.dragStartY;
                comp.shouldUpdate = true;
                comp.physicsEnabled = true;
                originZone.hideCueCard?.();
                originZone._originCard = null;
                originZone._cueIndex = null;
            }
        });

    } else {
        // Valid drop: cleanup cue from origin
        originZone?.hideCueCard?.();
        originZone._cueIndex = null;
    }

    // Restore card visuals
    if (gameObject.cardShadow) {
        this.tweens.add({
            targets: gameObject.cardShadow,
            alpha: 0,
            scale: 1,
            ease: EASE,
            duration: CARD_TWEENS.SHORT_DURATION,
        });
    }

    this.tweens.add({
        targets: gameObject,
        scale: CARD_TWEENS.IDLE_SCALE,
        ease: CARD_TWEENS.EASE,
        duration: CARD_TWEENS.SHORT_DURATION,
    });
}