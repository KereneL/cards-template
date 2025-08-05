import { InputComponent } from '../../components/input-component';

export class InputManager {

    static _instance = null
    static getInstance(scene) {
        if (InputManager._instance == null) {
            InputManager._instance = new InputManager(scene);
        }
        return InputManager._instance;
    }

    constructor(scene) {
        this.scene = scene;
        this.didJustDrag = false;
        this.lastOriginalZone = null;
        this.lastDropZone = null;

        const inputEvents = [
            { evSymbol: 'gameobjectover', callback: this.gameObjectOver },
            { evSymbol: 'gameobjectmove', callback: this.gameObjectMove },
            { evSymbol: 'gameobjectout', callback: this.gameObjectOut },
            { evSymbol: 'gameobjectdown', callback: this.gameObjectDown },
            { evSymbol: 'gameobjectup', callback: this.gameObjectUp },
            { evSymbol: 'dragstart', callback: this.onDragStart },
            { evSymbol: 'drag', callback: this.onDrag },
            { evSymbol: 'dragenter', callback: this.onDragEnter },
            { evSymbol: 'dragleave', callback: this.onDragLeave },
            { evSymbol: 'dragover', callback: this.onDragOver },
            { evSymbol: 'drop', callback: this.onDrop },
            { evSymbol: 'dragend', callback: this.onDragEnd },
        ]
        this.applyListeners(inputEvents)
    }
    applyListeners(inputEvents) {
        inputEvents.forEach(event => {
            this.scene.input.on(event.evSymbol, event.callback, this);
        });
    }

    // HOVER
    gameObjectOver(pointer, gameObject, event) {
        const comp = InputComponent.getComp(gameObject);
        if (!comp || !comp.isHoverable || comp.isBeingDragged) return;

        gameObject?.onPointerOver?.(pointer)
    }
    gameObjectMove(pointer, gameObject, event) {
        const comp = InputComponent.getComp(gameObject);
        if (!comp || !comp.isHoverable || comp.isBeingDragged) return;

        gameObject?.onPointerMove?.(pointer)
    }
    gameObjectOut(pointer, gameObject, event) {
        const comp = InputComponent.getComp(gameObject);
        if (!comp || !comp.isHoverable || comp.isBeingDragged) return;

        gameObject?.onPointerOut?.(pointer)
    }

    // CLICK
    gameObjectDown(pointer, gameObject, event) {
        const comp = InputComponent.getComp(gameObject);
        if (!comp || !comp.isClickable || comp.isBeingDragged) return;
        gameObject?.onPointerDown?.(pointer)
    }
    gameObjectUp(pointer, gameObject, event) {
        const comp = InputComponent.getComp(gameObject);
        if (!comp || !comp.isClickable || comp.isBeingDragged) return;
        gameObject?.onPointerUp?.(pointer)
    }

    // DRAG
    onDragStart(pointer, gameObject) {
        const comp = InputComponent.getComp(gameObject);
        if (!comp || !comp.isDraggable || comp.isBeingDragged) return;

        this.lastOriginalZone = gameObject.parentZone;
        comp.isBeingDragged = true;
        comp.shouldUpdate = true;
        comp.lastPointerX = pointer.x;

        comp.originalZone = gameObject.parentZone;
        comp.originalZone?.handleDragStart?.(gameObject);

        gameObject.scene.children.bringToTop(comp.originalZone)
        gameObject.setDepth(999)
        comp.originalZone.sortChildren('depth')
        gameObject.scaleForDrag()
    }
    onDrag(pointer, gameObject, dragX, dragY) {
        const comp = InputComponent.getComp(gameObject);
        if (!comp || !comp.isDraggable || !comp.isBeingDragged) return;

        comp.targetX = dragX;
        comp.targetY = dragY;
    }
    onDragEnter(pointer, gameObject, dropZone) {
        const comp = InputComponent.getComp(dropZone);
        if (!comp || !comp.isDropZone) return;

        dropZone?.handleDragEnter?.(gameObject);
    }
    onDragLeave(pointer, gameObject, dropZone) {
        const comp = InputComponent.getComp(dropZone);
        if (!comp || !comp.isDropZone) return;

        dropZone?.handleDragLeave?.(gameObject);
    }
    onDragOver(pointer, gameObject, dropZone) {
        const comp = InputComponent.getComp(dropZone);
        if (!comp || !comp.isDropZone) return;

        dropZone?.handleDragOver?.(gameObject);
    }
    onDrop(pointer, gameObject, dropZone) {
        this.lastDropZone = dropZone
    }
    onDragEnd(pointer, gameObject) {
        const isValidMove = this.checkForValidMove(gameObject);
        const droppedComp = InputComponent.getComp(gameObject);

        const originalZone = droppedComp?.originalZone;
        const dropZone = this.lastDropZone;

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

        if (isValidMove) {
            const isDiffZone = originalZone !== dropZone;
            if (isDiffZone) {
                dropZone.transferCardFromZone(originalZone, gameObject);
            }
            dropZone.handleDrop(gameObject);
            this.dragEndCleanup(gameObject, originalZone, dropZone)
        } else {
            gameObject.parentContainer = originalZone;
            gameObject.parentZone = originalZone;

            droppedComp.physicsEnabled = false;
            droppedComp.shouldUpdate = false;
            droppedComp.targetX = droppedComp.currentX;
            droppedComp.targetY = droppedComp.currentY;

            gameObject.shakeForInvalidMove(() => {
                droppedComp.targetX = gameObject.input.dragStartX;
                droppedComp.targetY = gameObject.input.dragStartY;
                droppedComp.physicsEnabled = true;
                droppedComp.shouldUpdate = true;
                this.dragEndCleanup(gameObject, originalZone, dropZone)
            })
        }
    }

    dragEndCleanup(gameObject, originalZone, dropZone) {
        if (gameObject) {
            gameObject?.scaleAfterDrag?.();
            const droppedComp = InputComponent.getComp(gameObject);
            droppedComp.isBeingDragged = false;
            droppedComp.rotationTarget = 0;
        }
        if (originalZone) {
            originalZone.hideCueCard?.();
            originalZone.originalCard = null;
            originalZone.cueIndex = null;
            originalZone.originalCueIndex = null;
            //const OriginalZoneComp = InputComponent.getComp(originalZone);
        }
        if (dropZone) {
            dropZone.hideCueCard?.();
            //const dropZoneComp = InputComponent.getComp(dropZone);
        };
        this.lastOriginalZone = null;
        this.lastDropZone = null;
    }
    checkForValidMove(gameObject) {
        // is zone dropped into is actually a DropZone?
        const dropZone = this.lastDropZone;
        if (!dropZone) {
            return false;
        }
        const dropZoneComp = InputComponent.getComp(dropZone);
        if (!dropZoneComp ||
            !dropZoneComp.isDropZone) {
            return false;
        }
        // is dropped object into is actually a draggable object dropped
        const droppedComp = InputComponent.getComp(gameObject);
        const originalZone = droppedComp?.originalZone;
        if (
            !droppedComp ||
            !droppedComp.isDraggable ||
            !droppedComp.isBeingDragged) {
            return false;
        }

        // is it allowed to take from- / drop into- the relevant zones?
        const originAllowTakingCards = originalZone.allowTakingCards;
        const targetAllowDroppingCards = dropZone.allowDroppingCards;
        if (
            !originAllowTakingCards ||
            !targetAllowDroppingCards) {
            return false;
        }

        // if all checks went thru, return true value
        return true;
    }
}
