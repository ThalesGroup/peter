export type EmbeddedPlatformId = string;
export const DefaultEmbeddedPlatformModelId = '-1';
export type TransportedPlatformId = string;
export const DefaultTransportedPlatformModelId = '-1';
export const DefaultSectorId = '-1';

export interface EmbeddedPlatformModel {
  id: EmbeddedPlatformId;
  sectorId: string;
  name: string;
  description: string;
  defaultValue: {
    description: string;
    value: number;
  };
}

export interface TransportedPlatformModel {
  id: TransportedPlatformId;
  sector: string;
  name: string;
  description: string;
  defaultValue: {
    description: string;
    value: number;
  };
}

export interface EquipmentMobilityConfiguration {
  embeddedPlatformModels: EmbeddedPlatformModel[];
  transportedPlatformModels: TransportedPlatformModel[];
}
