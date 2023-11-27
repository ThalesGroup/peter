import { v4 as uuidV4 } from 'uuid';

export const massOfMaterialBuilder = ({
  id = uuidV4(),
  materialId = 'default-material-id',
  mass = 0,
}: { id?: string; materialId?: string; mass?: number } = {}) => {
  const props = { id, materialId, mass };

  return {
    withId(massOfMaterialId: string) {
      return massOfMaterialBuilder({
        ...props,
        id: massOfMaterialId,
      });
    },
    withMaterialId(usedMaterialId: string) {
      return massOfMaterialBuilder({
        ...props,
        materialId: usedMaterialId,
      });
    },
    withMass(massOfMaterial: number) {
      return massOfMaterialBuilder({
        ...props,
        mass: massOfMaterial,
      });
    },

    build() {
      return {
        id,
        materialId,
        mass,
      };
    },
  };
};
