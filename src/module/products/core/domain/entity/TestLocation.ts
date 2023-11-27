export type TestLocationId = string;
export const DefaultLocationId = '-1';

export interface TestLocation {
  id: TestLocationId;
  name: string;
  description: string;
}
