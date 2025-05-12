
import Phaser from 'phaser';
import { InputCardComponent } from './components/input-component';
import { CARD_TWEENS } from './config'

export function worldToLocal(worldX, worldY, container) {
  const matrix = new Phaser.GameObjects.Components.TransformMatrix();
  container.getWorldTransformMatrix(matrix);
  matrix.invert();
  return matrix.transformPoint(worldX, worldY);
}

export function CardPhysicsSystem(scene, pointer = scene.input.activePointer) {
  const {
    DAMP_FACTOR,
    IDLE_THRESHOLD,
    MAX_ROTATE,
    ROTATION_EASE_SOFT,
    ROTATION_EASE_HARD
  } = CARD_TWEENS;

  for (const card of scene.activeCards) {
    const comp = InputCardComponent.getComp(card);
if (!comp || !comp.physicsEnabled) continue;

    // Position interpolation
    comp.currentX = Phaser.Math.Linear(comp.currentX, comp.targetX, 0.25);
    comp.currentY = Phaser.Math.Linear(comp.currentY, comp.targetY, 0.25);

    const finalX = comp.currentX + (comp.shakeOffsetX || 0);
    card.setPosition(finalX, comp.currentY);

    // Rotation logic
    if (comp.isDragging) {
      if (comp.lastPointerX !== null) {
        const deltaX = pointer.x - comp.lastPointerX;
        comp.velocityX = Phaser.Math.Linear(comp.velocityX, deltaX, 0.5);
      }
      comp.lastPointerX = pointer.x;

      let targetRotation = 0;
      if (Math.abs(comp.velocityX) > IDLE_THRESHOLD) {
        targetRotation = Phaser.Math.Clamp(comp.velocityX * DAMP_FACTOR, -MAX_ROTATE, MAX_ROTATE);
      }

      comp.currentRotation = Phaser.Math.Linear(comp.currentRotation, targetRotation, ROTATION_EASE_SOFT);
      card.setRotation(comp.currentRotation);

      if (
        Math.abs(comp.velocityX) < IDLE_THRESHOLD &&
        Math.abs(comp.currentRotation) < 0.01
      ) {
        comp.currentRotation = 0;
        card.setRotation(0);
      }
    } else {
      comp.currentRotation = Phaser.Math.Linear(
        comp.currentRotation,
        comp.rotationTarget,
        ROTATION_EASE_HARD
      );
      card.setRotation(comp.currentRotation);
    }
  }
}

