import { BaseComponent } from '../base-component';

export class DropZoneComponent extends BaseComponent {
  constructor(zone, onDrop = () => {}) {
    super(zone);
    this.onDrop = onDrop;
  }

  handleDrop(droppedCard) {
    this.onDrop(droppedCard, this.gameObject); 
  }

  static getAllZones(scene) {
    return scene.children.list.filter(obj => DropZoneComponent.getComp(obj));
  }
}
