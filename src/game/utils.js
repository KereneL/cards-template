import Phaser from 'phaser';

export function worldToLocal(worldX, worldY, container) {
  const matrix = new Phaser.GameObjects.Components.TransformMatrix();
  container.getWorldTransformMatrix(matrix);
  matrix.invert();
  return matrix.transformPoint(worldX, worldY);
}