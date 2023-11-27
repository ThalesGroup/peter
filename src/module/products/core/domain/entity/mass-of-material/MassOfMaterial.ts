import { MaterialId } from '../Material';

export type MassOfMaterialId = string;

export interface MassOfMaterialState {
  id: MassOfMaterialId;
  materialId: MaterialId;
  mass: number;
}

export class MassOfMaterial {
  constructor(
    readonly id: MassOfMaterialId,
    private readonly materialId: MaterialId,
    private readonly mass: number
  ) {}

  static fromState(state: MassOfMaterialState) {
    return new MassOfMaterial(state.id, state.materialId, state.mass);
  }

  get state(): MassOfMaterialState {
    return {
      id: this.id,
      materialId: this.materialId,
      mass: this.mass,
    };
  }
}
