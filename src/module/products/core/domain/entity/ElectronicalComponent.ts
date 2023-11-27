export type ElectronicComponentId = string;
export const DefaultElectronicComponentId = '-1';

export interface ElectronicComponent {
  id: ElectronicComponentId;
  name: string;
}
