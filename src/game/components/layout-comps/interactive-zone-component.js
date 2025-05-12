import { BaseComponent } from '../base-component';

export class InteractiveZoneComponent extends BaseComponent {
  constructor(zoneContainer, onDropCallback = null) {
    super(zoneContainer);

    const { width, height } = zoneContainer;
    this.zone = zoneContainer.scene.add.zone(0, 0, width, height)
      .setOrigin(0.5)
      .setInteractive({ dropZone: true });

    zoneContainer.add(this.zone);
    this.onDrop = onDropCallback;

    this._registerGlobalDropListener();
  }

  _registerGlobalDropListener() {
    const scene = this.scene;
    if (!scene._hasGlobalDropListener) {
      scene._hasGlobalDropListener = true;

      scene.input.on('drop', (pointer, gameObject, dropZone) => {
        for (const obj of scene.children.list) {
          const comp = InteractiveZoneComponent.getComp(obj);
          if (comp && comp.zone === dropZone) {
            const container = obj; 

            container.transferCardFromZone(gameObject.parentZone, gameObject);

            comp.onDrop?.(gameObject, container);
          }
        }
      });
    }
  }
}