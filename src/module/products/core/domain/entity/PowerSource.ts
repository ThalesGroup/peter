export type PowerSourceId = string;

export const DefaultPowerSourceId: PowerSourceId = '-1';

export interface PowerSource {
  id: PowerSourceId;
  name: string;
  description: string;
}
