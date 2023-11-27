import { v4 as uuidV4 } from 'uuid';

export const massOfComponentBuilder = ({
  id = uuidV4(),
  componentId = 'default-component-id',
  mass = 0,
}: { id?: string; componentId?: string; mass?: number } = {}) => {
  const props = { id, componentId, mass };

  return {
    withId(massOfComponentId: string) {
      return massOfComponentBuilder({
        ...props,
        id: massOfComponentId,
      });
    },
    withComponentId(usedComponentId: string) {
      return massOfComponentBuilder({
        ...props,
        componentId: usedComponentId,
      });
    },
    withMass(massOfComponent: number) {
      return massOfComponentBuilder({
        ...props,
        mass: massOfComponent,
      });
    },

    build() {
      return {
        id,
        componentId,
        mass,
      };
    },
  };
};
